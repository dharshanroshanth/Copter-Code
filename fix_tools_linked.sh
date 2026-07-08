#!/bin/bash
awk '
BEGIN { skip = 0 }
/const linkedAspectRef = React.useRef/ {
  print "  const linkedAspectRef = React.useRef(1920/1080);"
  print "  React.useEffect(() => {"
  print "    if (isLinked && dimensions.w > 0 && dimensions.h > 0 && activeRatio !== \"custom\") {"
  print "      linkedAspectRef.current = dimensions.w / dimensions.h;"
  print "    }"
  print "  }, [isLinked, dimensions.w, dimensions.h, activeRatio]);"
  skip = 1
  next
}
skip == 1 && /  \/\/ Layers State/ {
  skip = 0
}
skip == 1 { next }

/onChange=\{\(e\) => \{/ {
  print
  in_onchange = 1
  next
}
in_onchange && /if \(isLinked\)/ {
  in_if_linked = 1
  if (w_or_h == "w") {
    print "                  if (isLinked) {"
    print "                    setDimensions({ w: newW, h: Math.round(newW / linkedAspectRef.current) });"
  } else {
    print "                  if (isLinked) {"
    print "                    setDimensions({ w: Math.round(newH * linkedAspectRef.current), h: newH });"
  }
  next
}
in_if_linked && /} else {/ {
  in_if_linked = 0
  print
  next
}
in_if_linked { next }

/const newW =/ { w_or_h = "w"; print; next }
/const newH =/ { w_or_h = "h"; print; next }

1
' ./src/pages/Tools.tsx > ./src/pages/Tools.tsx.tmp
mv ./src/pages/Tools.tsx.tmp ./src/pages/Tools.tsx
