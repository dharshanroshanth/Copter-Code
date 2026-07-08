#!/bin/bash
sed -i "s/onClick={() => store.setView('tools')}/onClick={() => { store.setActiveQuickTool('enhancer'); store.setView('tools'); }}/g" ./src/pages/Dashboard.tsx
