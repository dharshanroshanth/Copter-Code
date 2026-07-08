const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

content = content.replace(
  "import QuickTools from './pages/QuickTools';",
  "import QuickTools from './pages/QuickTools';\nimport BgRemover from './pages/BgRemover';"
);

content = content.replace(
  "case 'quick-tools':\n        return <QuickTools />;",
  "case 'quick-tools':\n        return <QuickTools />;\n      case 'bg-remover':\n        return <BgRemover />;"
);

fs.writeFileSync('./src/App.tsx', content);
