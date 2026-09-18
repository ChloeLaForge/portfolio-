// cropshot.swift — portfolio-only screenshot derivation for the Notebook and
// Barclay Woods product captures supplied with browser (Safari) chrome on top.
//
// Unlike tools/cropstill.swift (a fixed fraction rect tuned for the Barclay
// screen-*recordings* that also carry a black rounded-corner desktop margin),
// these captures are full-bleed browser content: the ONLY thing to remove is
// the Safari toolbar band across the top. So the crop is a single top inset,
// expressed as a fraction of the frame height so it is resolution-independent
// across the mixed capture sizes in this set.
//
// Nothing here touches either application. It reads a copy of the raw PNG and
// writes a new cropped PNG derivative; the originals are never modified.
//
// Usage: cropshot <in.png> <out.png> <topFrac> [maxWidth] [sideFrac] [botFrac]
//   topFrac   fraction of height removed from the top (e.g. 0.052)
//   maxWidth  output is scaled down to at most this many px wide (default 1600)
//   sideFrac  fraction of width removed from EACH side   (default 0)
//   botFrac   fraction of height removed from the bottom (default 0)

import AppKit

let args = CommandLine.arguments
guard args.count >= 4 else {
    FileHandle.standardError.write("usage: cropshot <in.png> <out.png> <topFrac> [maxWidth] [sideFrac] [botFrac]\n".data(using: .utf8)!)
    exit(2)
}
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
let topFrac = Double(args[3]) ?? 0
let maxW = args.count >= 5 ? (Double(args[4]) ?? 1600) : 1600
let sideFrac = args.count >= 6 ? (Double(args[5]) ?? 0) : 0
let botFrac = args.count >= 7 ? (Double(args[6]) ?? 0) : 0

guard let src = NSImage(contentsOf: inURL),
      let tiff = src.tiffRepresentation,
      let rep = NSBitmapImageRep(data: tiff) else {
    FileHandle.standardError.write("FAIL: cannot read \(inURL.path)\n".data(using: .utf8)!)
    exit(1)
}
let w = Double(rep.pixelsWide)
let h = Double(rep.pixelsHigh)

// CGImage origin is top-left for cropping(to:).
let cx = Int((w * sideFrac).rounded())
let cy = Int((h * topFrac).rounded())
let cw = Int((w - 2 * w * sideFrac).rounded())
let ch = Int((h - h * topFrac - h * botFrac).rounded())

guard cw > 0, ch > 0,
      let cg = rep.cgImage?.cropping(to: CGRect(x: cx, y: cy, width: cw, height: ch)) else {
    FileHandle.standardError.write("FAIL: crop failed\n".data(using: .utf8)!)
    exit(1)
}

let scale = min(1.0, maxW / Double(cw))
let outW = Int((Double(cw) * scale).rounded())
let outH = Int((Double(ch) * scale).rounded())

let outRep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: outW, pixelsHigh: outH,
                              bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                              colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
outRep.size = NSSize(width: outW, height: outH)
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: outRep)
NSGraphicsContext.current?.imageInterpolation = .high
NSGraphicsContext.current?.cgContext.draw(cg, in: CGRect(x: 0, y: 0, width: outW, height: outH))
NSGraphicsContext.restoreGraphicsState()

guard let png = outRep.representation(using: .png, properties: [:]) else {
    FileHandle.standardError.write("FAIL: encode failed\n".data(using: .utf8)!)
    exit(1)
}
try png.write(to: outURL)
FileHandle.standardError.write("ok  \(inURL.lastPathComponent)  \(Int(w))x\(Int(h)) -> \(outW)x\(outH)  (top \(cy)px)\n".data(using: .utf8)!)
