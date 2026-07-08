#!/bin/bash
awk '/React.useEffect\(\(\) => \{/ {
  inEffect = 1
}
/linkedAspectRef\.current = dimensions\.w \/ dimensions\.h;/ {
  if (inEffect) {
    print "    if (isLinked && dimensions.w > 0 && dimensions.h > 0 && activeRatio !== \"custom\") {"
    print "      linkedAspectRef.current = dimensions.w / dimensions.h;"
    print "    }"
    next
  }
}
/}, \[isLinked\]\);/ {
  if (inEffect) {
    print "  }, [isLinked, dimensions.w, dimensions.h, activeRatio]);"
    inEffect = 0
    next
  }
}
1' ./src/pages/Tools.tsx > ./src/pages/Tools.tsx.tmp
mv ./src/pages/Tools.tsx.tmp ./src/pages/Tools.tsx
