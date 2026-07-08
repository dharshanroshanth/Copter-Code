const fs = require('fs');
['./src/pages/BgRemover.tsx', './src/pages/PassportPhoto.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /removeBackground\(image, \{/g,
    "imglyRemoveBackground(image, {"
  );
  fs.writeFileSync(file, content);
});
