const fs = require('fs');
let content = fs.readFileSync('./src/pages/Tools.tsx', 'utf8');

const useE = `
  React.useEffect(() => {
    if (activeNav === 'crop' && !crop) {
      handleRatioClick(activeRatio);
    }
  }, [activeNav]);
`;

content = content.replace(
  "  const handleRatioClick = (ratioId: string) => {",
  useE + "\n  const handleRatioClick = (ratioId: string) => {"
);

fs.writeFileSync('./src/pages/Tools.tsx', content);
