/**
 * Client-side image compression helper
 * Resizes large high-resolution photos (e.g. 12MP-48MP iPhone / Android cameras) before upload.
 * Keeps retina e-commerce crispness while reducing file size from 8-15MB down to ~300-800KB.
 * Built with iOS Safari WebKit compatibility:
 * - Uses URL.createObjectURL (zero-memory allocation vs FileReader base64)
 * - Detects image by MIME type or file extension (fixes iOS Safari empty file.type bug)
 * - Safe canvas downscaling with aspect ratio preservation
 */

export async function compressImageIfNeeded(file: File, maxDimension = 1920, quality = 0.82): Promise<File | Blob> {
  // 1. Detect if it's an image either by MIME type or file extension
  const isImageMime = Boolean(file.type && file.type.startsWith('image/'));
  const isImageExt = /\.(jpe?g|png|webp|heic|heif|bmp)$/i.test(file.name);
  const isImage = isImageMime || isImageExt;

  // Skip videos, GIFs, SVGs, or non-images
  if (!isImage || file.type.includes('gif') || file.type.includes('svg')) {
    return file;
  }

  // If already under 1MB, no downscaling needed
  if (file.size <= 1024 * 1024) {
    return file;
  }

  // Check if running in browser
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  return new Promise((resolve) => {
    // 6-second timeout fallback in case WebKit stalls
    const timeout = setTimeout(() => {
      resolve(file);
    }, 6000);

    let objectUrl: string | null = null;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      clearTimeout(timeout);
      resolve(file);
      return;
    }

    const img = new Image();

    img.onload = () => {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);

      try {
        let { width, height } = img;

        // Calculate aspect-ratio preserved downscaling if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const baseName = file.name.replace(/\.[^.]+$/, '');
              const newFileName = `${baseName || 'upload'}.jpg`;

              try {
                // Try constructing a File object
                const compressedFile = new File([blob], newFileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } catch {
                // WebKit fallback: resolve the Blob directly
                resolve(blob);
              }
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        console.warn('Canvas compression error, using original file:', err);
        resolve(file);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
