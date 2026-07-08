const fs = require('fs');
let content = fs.readFileSync('./src/pages/Dashboard.tsx', 'utf8');

content = content.replace(
  '<button className="text-[14px] font-semibold text-[#6366F1] hover:text-indigo-700 flex items-center gap-1 transition-colors">',
  '<button onClick={() => store.setView(\'quick-tools\')} className="text-[14px] font-semibold text-[#6366F1] hover:text-indigo-700 flex items-center gap-1 transition-colors">'
);

fs.writeFileSync('./src/pages/Dashboard.tsx', content);
