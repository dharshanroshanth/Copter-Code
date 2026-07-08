#!/bin/bash
# 1. Add states to Tools.tsx
sed -i 's/const { selectedImage } = useStore();/const { selectedImage, activeQuickTool } = useStore();\n  const [isProcessing, setIsProcessing] = React.useState(false);\n  const [toastMessage, setToastMessage] = React.useState<string | null>(null);/g' ./src/pages/Tools.tsx

# 2. Add activeImage useEffect
sed -i '/const \[activeImage, setActiveImage\] = React.useState(selectedImage || defaultImage);/a \  React.useEffect(() => { if (selectedImage) setActiveImage(selectedImage); }, [selectedImage]);' ./src/pages/Tools.tsx

# 3. Add activeQuickTool useEffect
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

# 4. Add overlay UI
awk '/<\/div>\s*<\/div>\s*\);/ {
  print "      {/* OVERLAYS */}"
  print "      {isProcessing && ("
  print "        <div className=\"absolute inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm\">"
  print "          <div className=\"bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4\">"
  print "            <div className=\"w-10 h-10 border-4 border-indigo-100 border-t-[#6366F1] rounded-full animate-spin\"></div>"
  print "            <span className=\"text-[14px] font-bold text-slate-700\">Applying AI Magic...</span>"
  print "          </div>"
  print "        </div>"
  print "      )}"
  print "      {toastMessage && ("
  print "        <div className=\"absolute top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#10b981] text-white px-6 py-3 rounded-full shadow-lg font-bold text-[14px] animate-in fade-in slide-in-from-top-4\">"
  print "          {toastMessage}"
  print "        </div>"
  print "      )}"
  print $0
  next
}1' ./src/pages/Tools.tsx > ./src/pages/Tools.tsx.tmp
mv ./src/pages/Tools.tsx.tmp ./src/pages/Tools.tsx

