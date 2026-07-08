#!/bin/bash
sed -i 's/const newW = parseInt(e.target.value) || 0;/setActiveRatio("custom");\n                  const newW = parseInt(e.target.value) || 0;/g' ./src/pages/Tools.tsx
sed -i 's/const newH = parseInt(e.target.value) || 0;/setActiveRatio("custom");\n                  const newH = parseInt(e.target.value) || 0;/g' ./src/pages/Tools.tsx
