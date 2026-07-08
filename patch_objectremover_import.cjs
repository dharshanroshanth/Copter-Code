const fs = require('fs');
let content = fs.readFileSync('./src/pages/ObjectRemover.tsx', 'utf8');
content = content.replace("Eraser, Upload, Download, Loader2, ArrowLeft, Image as ImageIcon, Undo", "Eraser, Upload, Download, Loader2, ArrowLeft, Image as ImageIcon, Undo, Wand2");
fs.writeFileSync('./src/pages/ObjectRemover.tsx', content);
