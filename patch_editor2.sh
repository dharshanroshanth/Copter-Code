#!/bin/bash
# Insert the useEffect after defaultTransform
awk '/const defaultTransform = \{ rotate: 0, flipX: false, flipY: false \};/ {
  print
  print "  React.useEffect(() => {"
  print "    if (activeQuickTool) {"
  print "      setIsProcessing(true);"
  print "      const timer = setTimeout(() => {"
  print "        setIsProcessing(false);"
  print "        let toolName = activeQuickTool;"
  print "        switch (activeQuickTool) {"
  print "          case \"bg-remover\": toolName = \"Background removed\"; break;"
  print "          case \"enhancer\": toolName = \"Image enhanced\"; break;"
  print "          case \"obj-remover\": toolName = \"Objects removed\"; break;"
  print "          case \"passport\": toolName = \"Passport photo generated\"; break;"
  print "          case \"ocr\": toolName = \"Text extracted\"; break;"
  print "          case \"compress\": toolName = \"Image compressed\"; break;"
  print "        }"
  print "        setToastMessage(`${toolName} successfully!`);"
  print "        store.setActiveQuickTool(null);"
  print "        setTimeout(() => setToastMessage(null), 3000);"
  print "      }, 2000);"
  print "      return () => clearTimeout(timer);"
  print "    }"
  print "  }, [activeQuickTool]);"
  next
}1' ./src/pages/Tools.tsx > ./src/pages/Tools.tsx.tmp
mv ./src/pages/Tools.tsx.tmp ./src/pages/Tools.tsx
