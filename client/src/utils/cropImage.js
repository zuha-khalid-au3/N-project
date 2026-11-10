export async function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

export async function getCroppedImageBlob(imageSrc, croppedAreaPixels, fileName = 'product.webp') {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const { width, height, x, y } = croppedAreaPixels;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  const blob = await new Promise((resolve) => {
    canvas.toBlob(
      (result) => resolve(result),
      'image/webp',
      0.92
    );
  });

  if (!blob) {
    throw new Error('Unable to crop image');
  }

  const safeName = fileName.replace(/\.[^.]+$/, '') || 'product';
  return new File([blob], `${safeName}.webp`, { type: 'image/webp' });
}
