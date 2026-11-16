import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from Multer
 * @param {Object} options - Cloudinary upload options (folder, resource_type, public_id, etc.)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: options.resource_type || 'auto',
        folder: options.folder || 'portfolio',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - 'image', 'raw', or 'video'
 * @returns {Promise<Object>} Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary destroy error:', error);
    throw error;
  }
};

/**
 * Ping Cloudinary to verify connection status
 */
export const pingCloudinary = async () => {
  return await cloudinary.api.ping();
};

export default cloudinary;
