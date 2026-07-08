const fs = require('fs');

['./src/pages/BgRemover.tsx', './src/pages/PassportPhoto.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    "import imglyRemoveBackground from '@imgly/background-removal';",
    "import { removeBackground } from '@imgly/background-removal';"
  );
  content = content.replace(
    /imglyRemoveBackground\(/g,
    "removeBackground("
  );
  fs.writeFileSync(file, content);
});
