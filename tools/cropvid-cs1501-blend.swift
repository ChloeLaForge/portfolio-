// cropvid-cs1501-blend.swift — crop Safari chrome + the black rounded-
// corner margin off content-human-ai-blend.mov (added after the original
// 5-clip CS1501 batch, so it gets its own tool rather than reusing
// cropvid-cs1501's hardcoded rect for that batch's window geometry).
// Same silent/cropped/poster-frame approach as cropvid-cs1501.swift and
// tools/cropvid.swift (the Barclay tool). No trim, no speed change.
//
// Usage: cropvid-cs1501-blend <input.mov> <output.mp4> <poster.jpg>
//
// Native recording is 3244x1992 (96px wider than the original batch's
// 3148x1992 — a differently-sized browser window, same capture rig: the
// outer window bezel is at the same x=112/y=76 top-left and the same
// y=443 content start, both verified identical to the original batch by
// sampling color transitions down several columns of a mid-clip frame).
// Crop rect measured the same way (pixel sampling a PNG frame dump, not
// the delivered/cropped file):
// - left = 112, top = 76: the window's own outer edge (same as the
//   original batch — same recording rig, just a wider window).
// - the site's own paper background starts at y=443 on every sampled
//   column (500/1000/1900/2500), identical to the original batch despite
//   this window showing an extra bookmarks-bar row — the chrome band's
//   total height is unchanged.
// - right = 3131: the window's true right edge (3130 is content, 3131+
//   is black), consistent across all sampled rows.
// - bottom = 1802 is the largest y with non-black pixels at both x=113
//   and x=3130 (the rounded-corner fade starts at 1803); cropped a
//   further 2px to 1800 for margin against video-compression bleed at
//   the edge, matching the CROP applied for delivery below.
let CROP = CGRect(x: 112, y: 443, width: 3019, height: 1357) // native px
let OUT_W = 1600
let BITRATE = 2_600_000

import AVFoundation
import AppKit
import CoreImage

let a = CommandLine.arguments
guard a.count == 4 else {
    FileHandle.standardError.write("usage: cropvid-cs1501-blend <in.mov> <out.mp4> <poster.jpg>\n".data(using: .utf8)!)
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
