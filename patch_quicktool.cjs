const fs = require('fs');
let content = fs.readFileSync('./src/pages/Tools.tsx', 'utf8');

content = content.replace(
  "    if (activeQuickTool) {\n      setIsProcessing(true);",
  `    if (activeQuickTool) {
      if (activeQuickTool === 'crop') {
        setActiveNav('crop');
        store.setActiveQuickTool(null);
        return;
      }
      setIsProcessing(true);`
);

fs.writeFileSync('./src/pages/Tools.tsx', content);
