import { removeBackground } from '@imgly/background-removal';
console.log("running");
removeBackground("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", {
    publicPath: "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/"
}).then(() => console.log("success")).catch(e => console.error(e));
