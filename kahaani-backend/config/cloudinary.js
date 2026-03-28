import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage configurations (Added Profile Storage here)
const artworkStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kahaani_artworks',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  }
});

const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kahaani_profiles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 200, height: 200, crop: 'fill' }] // Auto-crop for profiles
  }
});

const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kahaani_audio',
    resource_type: 'raw',
    format: 'webm'
  }
});

const uploadArtwork = multer({ storage: artworkStorage });
const uploadProfile = multer({ storage: profileStorage }); // Create the missing tool
const uploadAudio = multer({ storage: audioStorage });

// 3. Helper Functions
const getThumbnailUrl = (publicId) => {
  return cloudinary.url(publicId, {
    width: 300, height: 300, crop: 'thumb', gravity: 'face', quality: 'auto'
  });
};

const restoreArtworkImage = async (publicId) => {
  try {
    const restoredUrl = cloudinary.url(publicId, { effect: "gen_restore" });
    const originalUrl = cloudinary.url(publicId);
    return { original: originalUrl, restored: restoredUrl };
  } catch (err) {
    throw new Error("Failed to restore image");
  }
};

// 4. THE COMPLETE EXPORT BLOCK
export { 
  cloudinary, 
  uploadArtwork, 
  uploadProfile, // Exported now!
  uploadAudio, 
  getThumbnailUrl, 
  restoreArtworkImage 
};