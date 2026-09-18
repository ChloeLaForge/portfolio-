// cropvid-cs1501.swift — crop Safari chrome + the black rounded-corner
// margin off the CS 1501 Course Content Website screen recordings and emit
// an audio-stripped H.264 .mp4 plus a poster .jpg. No trim, no speed change
// (2x stays the site's playbackRate). AVAssetReader/Writer so the bitrate
// is actually controlled. Mirrors tools/cropvid.swift (the Barclay tool);
// parameterized here for this recording batch's own window geometry.
//
// Usage: cropvid-cs1501 <input.mov> <output.mp4> <poster.jpg>
//
// The crop rect is in the recordings' native 3148x1992 space and is
// identical for every clip in this batch (same capture window every time):
// measured by scanning pixel rows/columns for the black-bezel edges
// (x=112, y=76, right=3035, bottom=1843 — verified identical across all
// 5 source .mov files) and then finding where the browser's own toolbar
// + tab strip + breadcrumb bar end and the site's own paper background
// begins (y=443, a sharp horizontal color transition on every sampled
// column). The bottom edge rounds off near the corners exactly like the
// Barclay recordings — y=1791 is the largest value with zero fully-black
// pixels at x=112 and x=3035 (checked against all 5 clips).
let CROP = CGRect(x: 112, y: 443, width: 2922, height: 1348) // native px
let OUT_W = 1600
let BITRATE = 2_600_000

import AVFoundation
import AppKit
import CoreImage

let a = CommandLine.arguments
guard a.count == 4 else {
    FileHandle.standardError.write("usage: cropvid-cs1501 <in.mov> <out.mp4> <poster.jpg>\n".data(using: .utf8)!)
    exit(2)
}
let inURL = URL(fileURLWithPath: a[1])
let outURL = URL(fileURLWithPath: a[2])
let posterURL = URL(fileURLWithPath: a[3])
try? FileManager.default.removeItem(at: outURL)
try? FileManager.default.removeItem(at: posterURL)

let outH = Int((CGFloat(OUT_W) * CROP.height / CROP.width).rounded() / 2) * 2
let scale = CGFloat(OUT_W) / CROP.width
let ciCtx = CIContext(options: [.useSoftwareRenderer: false])
let sem = DispatchSemaphore(value: 0)

Task {
    do {
        let asset = AVURLAsset(url: inURL)
        guard let track = try await asset.loadTracks(withMediaType: .video).first else {
            throw NSError(domain: "cropvid", code: 1, userInfo: [NSLocalizedDescriptionKey: "no video track"])
        }
        let fpsRaw = try await track.load(.nominalFrameRate)
        let fps = (fpsRaw > 1 && fpsRaw < 121) ? Int(fpsRaw.rounded()) : 60

        let reader = try AVAssetReader(asset: asset)
        let rOut = AVAssetReaderTrackOutput(track: track, outputSettings: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA
        ])
        rOut.alwaysCopiesSampleData = false
        reader.add(rOut)

        let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
        let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
            AVVideoCodecKey: AVVideoCodecType.h264,
            AVVideoWidthKey: OUT_W,
            AVVideoHeightKey: outH,
            AVVideoCompressionPropertiesKey: [
                AVVideoAverageBitRateKey: BITRATE,
                AVVideoMaxKeyFrameIntervalKey: fps * 2,
                AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
                AVVideoAllowFrameReorderingKey: true,
            ],
        ])
        wIn.expectsMediaDataInRealTime = false
        let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: wIn, sourcePixelBufferAttributes: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
            kCVPixelBufferWidthKey as String: OUT_W,
            kCVPixelBufferHeightKey as String: outH,
        ])
        writer.add(wIn)

        guard reader.startReading() else { throw reader.error ?? NSError(domain: "cropvid", code: 4) }
        writer.startWriting()
        writer.startSession(atSourceTime: .zero)

        var savedPoster = false
        let q = DispatchQueue(label: "cropvid.encode")
        wIn.requestMediaDataWhenReady(on: q) {
            while wIn.isReadyForMoreMediaData {
                guard let sb = rOut.copyNextSampleBuffer(),
                      let px = CMSampleBufferGetImageBuffer(sb) else {
                    wIn.markAsFinished()
                    writer.finishWriting {
                        if writer.status == .completed { sem.signal() }
                        else {
                            FileHandle.standardError.write("FAIL \(inURL.lastPathComponent): writer \(writer.error?.localizedDescription ?? "?")\n".data(using: .utf8)!)
                            exit(1)
                        }
                    }
                    return
                }
                let pts = CMSampleBufferGetPresentationTimeStamp(sb)
                let src = CIImage(cvPixelBuffer: px)
                // crop (CoreImage y-origin is bottom-left) then scale to output
                let flippedY = src.extent.height - CROP.origin.y - CROP.height
                let cropped = src.cropped(to: CGRect(x: CROP.origin.x, y: flippedY, width: CROP.width, height: CROP.height))
                    .transformed(by: CGAffineTransform(translationX: -CROP.origin.x, y: -flippedY))
                    .transformed(by: CGAffineTransform(scaleX: scale, y: scale))

                var outPB: CVPixelBuffer?
                CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &outPB)
                guard let dst = outPB else { continue }
                ciCtx.render(cropped, to: dst)
                adaptor.append(dst, withPresentationTime: pts)

                if !savedPoster {
                    savedPoster = true
                    let rep = NSBitmapImageRep(ciImage: cropped)
                    if let jpg = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82]) {
                        try? jpg.write(to: posterURL)
                    }
                }
            }
        }
        sem.wait()
        FileHandle.standardError.write("ok  \(inURL.lastPathComponent)  -> \(OUT_W)x\(outH)\n".data(using: .utf8)!)
        exit(0)
    } catch {
        FileHandle.standardError.write("FAIL \(inURL.lastPathComponent): \(error)\n".data(using: .utf8)!)
        exit(1)
    }
}
RunLoop.main.run()
