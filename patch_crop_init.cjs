const fs = require('fs');
let content = fs.readFileSync('./src/pages/Tools.tsx', 'utf8');

content = content.replace(
  "    if (aspect) {\n      setCrop({ unit: '%', width: 80, height: 80 / aspect, x: 10, y: 10 });\n    } else {\n      setCrop(undefined);\n    }",
  `    if (aspect) {
      setCrop({ unit: '%', width: 80, height: 80 / aspect, x: 10, y: 10 });
    } else {
      setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
    }`
);

fs.writeFileSync('./src/pages/Tools.tsx', content);
