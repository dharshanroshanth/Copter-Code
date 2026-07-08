#!/bin/bash
awk '/const \[isLinked, setIsLinked\] = React.useState\(true\);/ {
  print
  print "  const linkedAspectRef = React.useRef(1920/1080);"
  print "  React.useEffect(() => {"
  print "    if (isLinked && dimensions.w > 0 && dimensions.h > 0) {"
  print "      linkedAspectRef.current = dimensions.w / dimensions.h;"
  print "    }"
  print "  }, [isLinked]);"
  next
}
/if \(isLinked && dimensions\.w > 0\) {/ {
  print "                  if (isLinked) {"
  print "                    setDimensions({ w: newW, h: Math.round(newW / linkedAspectRef.current) });"
  next
}
/if \(isLinked && dimensions\.h > 0\) {/ {
  print "                  if (isLinked) {"
  print "                    setDimensions({ w: Math.round(newH * linkedAspectRef.current), h: newH });"
  next
}
/const aspect =/ { next }
/setDimensions\({ w: Math\.round\(newW \* aspect\)/ { next }
/setDimensions\({ w: Math\.round\(newH \* aspect\)/ { next }
1' ./src/pages/Tools.tsx > ./src/pages/Tools.tsx.tmp
mv ./src/pages/Tools.tsx.tmp ./src/pages/Tools.tsx
