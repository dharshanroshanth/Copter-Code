#!/bin/bash
sed -i 's/const { selectedImage } = useStore();/const { selectedImage, activeQuickTool } = useStore();\n  const [isProcessing, setIsProcessing] = React.useState(false);\n  const [toastMessage, setToastMessage] = React.useState<string | null>(null);/g' ./src/pages/Tools.tsx

