const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

content = content.replace(
  "import ImageEnhancer from './pages/ImageEnhancer';",
  "import ImageEnhancer from './pages/ImageEnhancer';\nimport ObjectRemover from './pages/ObjectRemover';"
);

content = content.replace(
  "case 'enhancer':\n        return <ImageEnhancer />;",
  "case 'enhancer':\n        return <ImageEnhancer />;\n      case 'obj-remover':\n        return <ObjectRemover />;"
);

fs.writeFileSync('./src/App.tsx', content);
