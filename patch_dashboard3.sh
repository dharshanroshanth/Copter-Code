#!/bin/bash
sed -i "s/onClick={() => { store.setActiveQuickTool('enhancer'); store.setView('tools'); }}/onClick={() => { store.setSelectedImage(proj.img); store.setView('tools'); }}/g" ./src/pages/Dashboard.tsx
# revert the first one back to just enhancer but KEEP the enhancer
sed -i "0,/onClick={() => { store.setSelectedImage(proj.img); store.setView('tools'); }}/s/onClick={() => { store.setSelectedImage(proj.img); store.setView('tools'); }}/onClick={() => { store.setActiveQuickTool('enhancer'); store.setView('tools'); }}/" ./src/pages/Dashboard.tsx

