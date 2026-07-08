const fs = require('fs');
let content = fs.readFileSync('./src/pages/Tools.tsx', 'utf8');

const oldImageRender = `                   <ReactCrop 
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
                         objectFit: 'contain',
                         filter: getFilterStyle(),
                         transform: \`rotate(\${transform.rotate}deg) scaleX(\${transform.flipX ? -1 : 1}) scaleY(\${transform.flipY ? -1 : 1})\`,
                         transformOrigin: 'center center'
                       }}
                     />
                   </ReactCrop>`;

const newImageRender = `                  {activeNav === 'crop' ? (
                    <ReactCrop 
                     crop={crop} 
                     onChange={c => setCrop(c)}
                     onComplete={c => setCompletedCrop(c)}
                     aspect={cropAspect}
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
                         objectFit: 'contain',
                         filter: getFilterStyle(),
                         transform: \`rotate(\${transform.rotate}deg) scaleX(\${transform.flipX ? -1 : 1}) scaleY(\${transform.flipY ? -1 : 1})\`,
                         transformOrigin: 'center center'
                       }}
                     />
                   </ReactCrop>
                  ) : (
                    <img 
                       ref={imageRef}
                       src={activeImage} 
                       alt="Editing Canvas" 
                       onLoad={handleImageLoad}
                       crossOrigin="anonymous"
                       style={{
                         width: '100%',
                         height: '100%',
                         objectFit: 'contain',
                         filter: getFilterStyle(),
                         transform: \`rotate(\${transform.rotate}deg) scaleX(\${transform.flipX ? -1 : 1}) scaleY(\${transform.flipY ? -1 : 1})\`,
                         transformOrigin: 'center center'
                       }}
                     />
                  )}`;

content = content.replace(oldImageRender, newImageRender);

fs.writeFileSync('./src/pages/Tools.tsx', content);
