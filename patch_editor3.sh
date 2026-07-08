#!/bin/bash
awk '/<\/div>    <\/div>  \);}/ {
  print "      {/* OVERLAYS */}"
  print "      {isProcessing && ("
  print "        <div className=\"absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm\">"
  print "          <div className=\"bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4\">"
  print "            <div className=\"w-10 h-10 border-4 border-indigo-100 border-t-[#6366F1] rounded-full animate-spin\"></div>"
  print "            <span className=\"text-[14px] font-bold text-slate-700\">Applying AI Magic...</span>"
  print "          </div>"
  print "        </div>"
  print "      )}"
  print "      {toastMessage && ("
  print "        <div className=\"absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#10b981] text-white px-6 py-3 rounded-full shadow-lg font-bold text-[14px] animate-in fade-in slide-in-from-top-4\">"
  print "          {toastMessage}"
  print "        </div>"
  print "      )}"
  print $0
  next
}1' ./src/pages/Tools.tsx > ./src/pages/Tools.tsx.tmp
mv ./src/pages/Tools.tsx.tmp ./src/pages/Tools.tsx
