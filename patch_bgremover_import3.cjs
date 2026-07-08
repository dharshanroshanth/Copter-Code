const fs = require('fs');
['./src/pages/BgRemover.tsx', './src/pages/PassportPhoto.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /imglyRemoveBackground\(\$1, \{/g,
    "imglyRemoveBackground(image, {"
  );
  fs.writeFileSync(file, content);
});
