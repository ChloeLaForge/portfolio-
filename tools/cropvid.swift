// cropvid.swift — crop Safari chrome + the black rounded-corner margin off the
// Barclay Woods screen recordings and emit an audio-stripped, bitrate-capped
// H.264 .mp4 plus a poster .jpg. No trim, no speed change (2x stays the site's
// playbackRate). AVAssetReader/Writer so the bitrate is actually controlled.
//
// Usage: cropvid <input.mov> <output.mp4> <poster.jpg>
//
// The crop rect is in the recordings' native 2872x2008 space and is identical
// for every clip (same capture window every time).

import AVFoundation
import AppKit
import CoreImage

let CROP = CGRect(x: 112, y: 214, width: 2648, height: 1596) // native px
let OUT_W = 1280
let BITRATE = 2_400_000

let a = CommandLine.arguments
guard a.count == 4 else {
    FileHandle.standardError.write("usage: cropvid <in.mov> <out.mp4> <poster.jpg>\n".data(using: .utf8)!)
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
