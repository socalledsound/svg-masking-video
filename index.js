async function main() {
    const canvas = document.querySelector('canvas');
    const canvasContext = canvas.getContext('2d');
    const canvasAspectRatio = canvas.width / canvas.height;
    
    const matte = document.querySelector('img');

    const mask = document.createElement('img');

    mask.src = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(document.querySelector('svg'))], {type: 'image/svg+xml'}));
    
    await Promise.all([
      new Promise((resolve) => mask.addEventListener('load', resolve, {once: true})),
      matte.complete || new Promise((resolve) => matte.addEventListener('load', resolve, {once: true})),
    ]);

    const matteAspectRatio = matte.naturalWidth / matte.naturalHeight, maskAspectRatio = mask.naturalWidth / mask.naturalHeight;

    let width, height, top, left;

    [width, height] =
  canvasAspectRatio <= matteAspectRatio
  ? [canvas.height * matteAspectRatio, canvas.height]
  : [canvas.width, canvas.width / matteAspectRatio];

[top, left] = [(canvas.height - height) / 2, (canvas.width - width) / 2];

canvasContext.drawImage(matte, 0, 0, matte.naturalWidth, matte.naturalHeight, left, top, width, height);

[width, height] = canvasAspectRatio <= maskAspectRatio
  ? [canvas.width, canvas.width / maskAspectRatio]
  : [canvas.height * maskAspectRatio, canvas.height];

[top, left] = [(canvas.height - height) / 2, (canvas.width - width) / 2];

canvasContext.globalCompositeOperation = 'destination-in';

canvasContext.drawImage(mask, left, top, width, height);


}

self.addEventListener('DOMContentLoaded', () => main().catch(console.error), {once: true});
