const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

content = content.replace(
  "case 'dashboard':",
  "case 'dashboard':\n        return <Dashboard />;\n      case 'quick-tools':\n        return <QuickTools />;\n      case 'dashboard_legacy':"
);

fs.writeFileSync('./src/App.tsx', content);
