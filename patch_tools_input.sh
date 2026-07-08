#!/bin/bash
sed -i 's/value={dimensions.w}/value={dimensions.w || ""}/g' ./src/pages/Tools.tsx
sed -i 's/value={dimensions.h}/value={dimensions.h || ""}/g' ./src/pages/Tools.tsx
