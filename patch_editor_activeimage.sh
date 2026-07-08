#!/bin/bash
sed -i '/const \[activeImage, setActiveImage\] = React.useState(selectedImage || defaultImage);/a \  React.useEffect(() => { if (selectedImage) setActiveImage(selectedImage); }, [selectedImage]);' ./src/pages/Tools.tsx
