const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

content = content.replace(
  "import ObjectRemover from './pages/ObjectRemover';",
  "import ObjectRemover from './pages/ObjectRemover';\nimport PassportPhoto from './pages/PassportPhoto';"
);

content = content.replace(
  "case 'obj-remover':\n        return <ObjectRemover />;",
  "case 'obj-remover':\n        return <ObjectRemover />;\n      case 'passport':\n        return <PassportPhoto />;"
);

fs.writeFileSync('./src/App.tsx', content);
