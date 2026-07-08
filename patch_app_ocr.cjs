const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

content = content.replace(
  "import PassportPhoto from './pages/PassportPhoto';",
  "import PassportPhoto from './pages/PassportPhoto';\nimport OCRScanner from './pages/OCRScanner';"
);

content = content.replace(
  "case 'passport':\n        return <PassportPhoto />;",
  "case 'passport':\n        return <PassportPhoto />;\n      case 'ocr':\n        return <OCRScanner />;"
);

fs.writeFileSync('./src/App.tsx', content);
