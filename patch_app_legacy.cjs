const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

content = content.replace(
  "      case 'dashboard_legacy':\n        return <Dashboard />;\n",
  ""
);

fs.writeFileSync('./src/App.tsx', content);
