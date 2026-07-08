const fs = require('fs');

let content = fs.readFileSync('./src/pages/Tools.tsx', 'utf8');

content = content.replace(
  "import {\n  Crop, Sliders, Sparkles, Type, Layers, Wand2, Image as ImageIcon,",
  "import {\n  Crop as CropIcon, Sliders, Sparkles, Type, Layers, Wand2, Image as ImageIcon,"
);

// We need to replace the usage of `<Crop ` with `<CropIcon `
// but careful, <Crop className=... />
content = content.replace(/<Crop\s/g, "<CropIcon ");

fs.writeFileSync('./src/pages/Tools.tsx', content);
