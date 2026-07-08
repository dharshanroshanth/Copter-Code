const fs = require('fs');

let content = fs.readFileSync('./src/pages/Tools.tsx', 'utf8');

// add imports
content = content.replace(
  "import {", 
  "import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';\nimport 'react-image-crop/dist/ReactCrop.css';\nimport {"
);

// add state
content = content.replace(
  "const [zoom, setZoom] = React.useState(100);",
  "const [zoom, setZoom] = React.useState(100);\n  const [crop, setCrop] = React.useState<Crop>();\n  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();\n  const [cropAspect, setCropAspect] = React.useState<number | undefined>();"
);

// update handleRatioClick to update cropAspect
content = content.replace(
  "const handleRatioClick = (ratioId: string) => {\n    setActiveRatio(ratioId);\n    if (!imageRef.current) return;\n    \n    const imgW = imageRef.current.naturalWidth;\n    const imgH = imageRef.current.naturalHeight;",
  `const handleRatioClick = (ratioId: string) => {
    setActiveRatio(ratioId);
    if (!imageRef.current) return;
    
    let aspect: number | undefined = undefined;
    switch (ratioId) {
      case '1:1': aspect = 1; break;
      case '16:9': aspect = 16 / 9; break;
      case '4:5': aspect = 4 / 5; break;
      case '9:16': aspect = 9 / 16; break;
      case '3:2': aspect = 3 / 2; break;
      case '2:3': aspect = 2 / 3; break;
      case 'original': aspect = imageRef.current.naturalWidth / imageRef.current.naturalHeight; break;
      case 'custom':
      case 'free':
        aspect = undefined; break;
    }
    setCropAspect(aspect);
    if (aspect) {
      setCrop({ unit: '%', width: 80, height: 80 / aspect, x: 10, y: 10 });
    } else {
      setCrop(undefined);
    }

    const imgW = imageRef.current.naturalWidth;
    const imgH = imageRef.current.naturalHeight;`
);

// change the img to be wrapped in ReactCrop when in crop mode? Or always?
// Actually if we just wrap it always but only enable it when activeNav === 'crop'.
// Wait, react-image-crop wraps the img.
content = content.replace(
  /<img\s+ref=\{imageRef\}\s+src=\{activeImage\}\s+alt="Editing Canvas"\s+onLoad=\{handleImageLoad\}\s+crossOrigin="anonymous"\s+style=\{\{\s+width: '100%',\s+height: '100%',\s+objectFit: 'cover',\s+filter: getFilterStyle\(\),\s+transform: `rotate\(\$\{transform\.rotate\}deg\) scaleX\(\$\{transform\.flipX \? -1 : 1\}\) scaleY\(\$\{transform\.flipY \? -1 : 1\}\)`,\s+transformOrigin: 'center center'\s+\}\}\s+\/>/m,
  `<ReactCrop 
                     crop={crop} 
                     onChange={c => setCrop(c)}
                     onComplete={c => setCompletedCrop(c)}
                     aspect={cropAspect}
                     disabled={activeNav !== 'crop'}
                     className={activeNav === 'crop' ? '' : 'ReactCrop--disabled'}
                   >
                     <img 
                       ref={imageRef}
                       src={activeImage} 
                       alt="Editing Canvas" 
                       onLoad={handleImageLoad}
                       crossOrigin="anonymous"
                       style={{
                         width: '100%',
                         height: '100%',
                         objectFit: 'cover',
                         filter: getFilterStyle(),
                         transform: \`rotate(\${transform.rotate}deg) scaleX(\${transform.flipX ? -1 : 1}) scaleY(\${transform.flipY ? -1 : 1})\`,
                         transformOrigin: 'center center'
                       }}
                     />
                   </ReactCrop>`
);

// wait, we need to apply the crop on download or save. 
// For now, let's just make the UI work and then handle the actual apply/download.
// A button to apply crop? The user just wants to see the cropper and be able to use it.
// Let's also add an "Apply Crop" button to the Crop panel.

fs.writeFileSync('./src/pages/Tools.tsx', content);
