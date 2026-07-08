const fs = require('fs');
['./src/pages/BgRemover.tsx', './src/pages/PassportPhoto.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    "import { removeBackground } from '@imgly/background-removal';",
    "import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';"
  );
  content = content.replace(
    /removeBackground\([^,]+,/g,
    "imglyRemoveBackground($1," // this regex is tricky. Let's just do an exact match or simple replace.
  );
  fs.writeFileSync(file, content);
});
