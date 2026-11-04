import { compressImageIfNeeded } from './imageCompression';

export interface UploadOptions {
  productId?: string;
  onProgress?: (percent: number, statusText: string) => void;
}

export interface UploadResult {
  url: string;
  isVideo: boolean;
  name: string;
}

/**
 * Uploads a file (image or video) using direct-to-Cloudinary signed upload.
 * Bypasses Vercel's 4.5MB serverless limit completely, allowing high-res camera
 * photos and videos up to 100MB.
 * Falls back to server /api/upload if direct signature fails.
 */
export async function uploadMediaFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { productId = 'misc', onProgress } = options;

  const isVideo = Boolean(
    file.type?.startsWith('video') ||
    /\.(mp4|mov|webm|avi|m4v|3gp|quicktime)$/i.test(file.name)
  );

  onProgress?.(10, `Preparing ${file.name}...`);

  // Compress raster photos client-side to save bandwidth & ensure rapid uploads
  // Videos are passed directly as-is
  let fileToUpload: File | Blob = file;
  if (!isVideo) {
    try {
      fileToUpload = await compressImageIfNeeded(file);
    } catch (err) {
      console.warn('Image compression fallback:', err);
      fileToUpload = file;
    }
  }

  // 1. Try Direct Signed Cloudinary Upload (no 4.5MB limit!)
  try {
    const signRes = await fetch(`/api/upload?productId=${encodeURIComponent(productId)}`);
    if (signRes.ok) {
      const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

      if (signature && apiKey && cloudName) {
        onProgress?.(30, `Uploading ${file.name} to Cloudinary...`);

        const cldFormData = new FormData();
        const safeName = isVideo
          ? file.name
          : file.name.replace(/\.[^.]+$/, '') + '.jpg';

        cldFormData.append('file', fileToUpload, safeName);
        cldFormData.append('api_key', String(apiKey));
        cldFormData.append('timestamp', String(timestamp));
        cldFormData.append('signature', String(signature));
        cldFormData.append('folder', String(folder));

        const endpoint = isVideo
          ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
          : `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

        const uploadRes = await fetch(endpoint, {
          method: 'POST',
          body: cldFormData,
        });

        if (uploadRes.ok) {
          const cldData = await uploadRes.json();
          if (cldData.secure_url) {
            onProgress?.(100, `Done!`);
            return {
              url: cldData.secure_url,
              isVideo,
              name: file.name,
            };
          }
        } else {
          console.warn('Direct Cloudinary upload returned non-200, trying proxy fallback...');
        }
      }
    }
  } catch (err) {
    console.warn('Direct upload error, falling back to proxy:', err);
  }

  // 2. Fallback: Server-side proxy upload via /api/upload
  onProgress?.(50, `Uploading via server proxy...`);

  if (fileToUpload.size > 4.5 * 1024 * 1024) {
    throw new Error(
      `"${file.name}" (${(fileToUpload.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum direct upload limits. Please ensure files are under 4.5MB for server fallback.`
    );
  }

  const safeName = isVideo ? file.name : file.name.replace(/\.[^.]+$/, '') + '.jpg';
  const formData = new FormData();
  formData.append('files', fileToUpload, safeName);
  formData.append('productId', productId);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) {
    const text = await res.text();
    let msg = `Server returned status ${res.status}`;
    if (res.status === 413 || text.includes('Request Entity Too Large')) {
      msg = `"${file.name}" is too large for server upload (exceeds 4.5MB limit).`;
    } else {
      try {
        const json = JSON.parse(text);
        if (json.error) msg = json.error;
      } catch {
        msg = text.slice(0, 100);
      }
    }
    throw new Error(msg);
  }

  const data = await res.json();
  if (data.urls && data.urls[0]) {
    onProgress?.(100, `Done!`);
    return {
      url: data.urls[0],
      isVideo,
      name: file.name,
    };
  }

  throw new Error(data.error || 'No URL returned from upload server');
}

