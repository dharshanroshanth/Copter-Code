#!/bin/bash
awk '
/const coverScale = Math\.max\(canvas\.width \/ imgW, canvas\.height \/ imgH\);/ {
  print "    const isRotated = transform.rotate % 180 !== 0;"
  print "    const effImgW = isRotated ? imgH : imgW;"
  print "    const effImgH = isRotated ? imgW : imgH;"
  print "    const coverScale = Math.max(canvas.width / effImgW, canvas.height / effImgH);"
  next
}
1
' ./src/pages/Tools.tsx > ./src/pages/Tools.tsx.tmp
mv ./src/pages/Tools.tsx.tmp ./src/pages/Tools.tsx
