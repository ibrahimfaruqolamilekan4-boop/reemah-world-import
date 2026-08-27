// Cloudinary Media Upload Utility for Reemah World Imports

export const getCloudinaryConfig = () => {
  const env = (import.meta as any).env || {};
  const cloudName = (env.VITE_CLOUDINARY_CLOUD_NAME || "roheemon").trim();
  const uploadPreset = (env.VITE_CLOUDINARY_UPLOAD_PRESET || "reehmah").trim();
  return { cloudName, uploadPreset };
};

/**
 * Compresses an image file on the client-side canvas to optimize upload speed and fidelity
 */
export const compressImage = (file: File, maxDimension: number = 1920, quality: number = 0.85): Promise<Blob> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

/**
 * Uploads an image or video file directly to Cloudinary using unsigned upload preset
 */
export const uploadMediaToCloudinary = async (
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<{ url: string; resourceType: 'image' | 'video' }> => {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary cloud name or upload preset is missing.');
  }

  const isVideo = file.type.startsWith('video/');
  const resourceType: 'image' | 'video' = isVideo ? 'video' : 'image';

  let uploadPayload: Blob | File = file;
  if (!isVideo && file.type.startsWith('image/')) {
    try {
      uploadPayload = await compressImage(file, 1920, 0.85);
    } catch {
      uploadPayload = file;
    }
  }

  const formData = new FormData();
  formData.append('file', uploadPayload);
  formData.append('upload_preset', uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && response.secure_url) {
          resolve({ url: response.secure_url, resourceType });
        } else {
          const errMsg = response.error?.message || `Upload failed with HTTP status ${xhr.status}`;
          reject(new Error(errMsg));
        }
      } catch (err: any) {
        reject(new Error(`Failed to parse Cloudinary response: ${err.message}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred while connecting to Cloudinary.'));
    };

    xhr.send(formData);
  });
};
