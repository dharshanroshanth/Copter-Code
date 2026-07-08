#!/bin/bash
sed -i "s/width: dimensions.w || 'auto'/width: '100%', height: '100%'/g" ./src/pages/Tools.tsx
