const fs = require('fs');
let content = fs.readFileSync('./src/pages/Tools.tsx', 'utf8');
content = content.replace("icon: Crop }", "icon: CropIcon }");
fs.writeFileSync('./src/pages/Tools.tsx', content);
