#!/bin/bash
sed -i 's/selectedImage: string | null;/selectedImage: string | null;\n  activeQuickTool: string | null;/g' ./src/store.ts
sed -i 's/selectedImage: null,/selectedImage: null,\n  activeQuickTool: null,/g' ./src/store.ts
sed -i 's/setSelectedImage(image: string | null) {/setActiveQuickTool(tool: string | null) {\n    globalState.activeQuickTool = tool;\n    notify();\n  },\n  setSelectedImage(image: string | null) {/g' ./src/store.ts
