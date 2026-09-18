// cropstill.swift — trim the Safari chrome + black rounded-corner margin off a
// Barclay Woods product screenshot so it matches the cropped screen recordings.
// Resolution-independent: the crop is expressed as fractions of the capture
// window, so it works whether the export is native (2872x2008) or downscaled.
//
// Usage: cropstill <in.png> <out.png> [maxWidth]
//   default maxWidth 1600.
//
// Same crop rect as tools/cropvid.swift (native x=170 y=214 w=2598 h=2872-...).

import AppKit

// fractions of the full capture frame (native 2872 x 2008)
let FX = 170.0 / 2872.0
let FY = 214.0 / 2008.0
let FW = 2598.0 / 2872.0
let FH = 1722.0 / 2008.0

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: cropstill <in.png> <out.png> [maxWidth]\n".data(using: .utf8)!)
    exit(2)
}
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
let maxW = args.count >= 4 ? (Double(args[3]) ?? 1600) : 1600

guard let src = NSImage(contentsOf: inURL),
      let tiff = src.tiffRepresentation,
      let rep = NSBitmapImageRep(data: tiff) else {
    FileHandle.standardError.write("FAIL: cannot read \(inURL.path)\n".data(using: .utf8)!)
    exit(1)
}
let w = Double(rep.pixelsWide)
let h = Double(rep.pixelsHigh)

var cx = Int((w * FX).rounded())
var cy = Int((h * FY).rounded())
var cw = Int((w * FW).rounded())
var ch = Int((h * FH).rounded())
cx = max(0, cx); cy = max(0, cy)
cw = min(cw, Int(w) - cx)
ch = min(ch, Int(h) - cy)

guard let cg = rep.cgImage?.cropping(to: CGRect(x: cx, y: cy, width: cw, height: ch)) else {
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
FileHandle.standardError.write("ok  \(inURL.lastPathComponent)  \(Int(w))x\(Int(h)) -> \(outW)x\(outH)\n".data(using: .utf8)!)
