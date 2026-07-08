const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

content = content.replace(
  "import BgRemover from './pages/BgRemover';",
  "import BgRemover from './pages/BgRemover';\nimport ImageEnhancer from './pages/ImageEnhancer';"
);

content = content.replace(
  "case 'bg-remover':\n        return <BgRemover />;",
  "case 'bg-remover':\n        return <BgRemover />;\n      case 'enhancer':\n        return <ImageEnhancer />;"
);

fs.writeFileSync('./src/App.tsx', content);
