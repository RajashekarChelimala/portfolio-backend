import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import Media from '../models/Media.js';
import Content from '../models/Content.js';

/**
 * Upload and update Administrator Profile Image
 * POST /media/upload/profile
 */
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'portfolio/profile',
      resource_type: 'image',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    // Record in Media collection
    const mediaRecord = await Media.create({
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      resource_type: 'image',
      bytes: uploadResult.bytes,
      folder: 'portfolio/profile',
      category: 'profile',
      originalFilename: req.file.originalname,
      uploadedBy: req.username || 'admin',
    });

    // Update Content document in MongoDB Atlas
    const content = await Content.findOne();
    if (content) {
      content.imageLink = uploadResult.secure_url;
      await content.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile photo successfully uploaded and updated!',
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      media: mediaRecord,
    });
  } catch (error) {
    console.error('Profile photo upload error:', error);
    res.status(500).json({ message: error.message || 'Failed to upload profile photo to Cloudinary.' });
  }
};

/**
 * Upload and update Curriculum Vitae / Resume PDF
 * POST /media/upload/resume
 */
export const uploadResumePdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded.' });
    }

    // PDFs uploaded with resource_type: 'raw' or 'image' for direct viewing
    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'portfolio/resume',
      resource_type: 'raw',
      format: 'pdf',
    });

    // Record in Media collection
    const mediaRecord = await Media.create({
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      format: 'pdf',
      resource_type: 'raw',
      bytes: uploadResult.bytes,
      folder: 'portfolio/resume',
      category: 'resume',
      originalFilename: req.file.originalname,
      uploadedBy: req.username || 'admin',
    });

    // Update Content document in MongoDB Atlas
    const content = await Content.findOne();
    if (content) {
      content.resumeLink = uploadResult.secure_url;
      await content.save();
    }

    res.status(200).json({
      success: true,
      message: 'Resume PDF successfully uploaded and published!',
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      media: mediaRecord,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: error.message || 'Failed to upload resume to Cloudinary.' });
  }
};

/**
 * Upload Post Cover Image or Article Attachment
 * POST /media/upload/post
 */
export const uploadPostMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No media file provided.' });
    }

    const folder = req.body.isContent ? 'portfolio/posts/content' : 'portfolio/posts/covers';

    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1400, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    const mediaRecord = await Media.create({
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      resource_type: 'image',
      bytes: uploadResult.bytes,
      folder,
      category: req.body.isContent ? 'post-content' : 'post-cover',
      originalFilename: req.file.originalname,
      uploadedBy: req.username || 'admin',
    });

    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      media: mediaRecord,
    });
  } catch (error) {
    console.error('Post media upload error:', error);
    res.status(500).json({ message: error.message || 'Failed to upload post image.' });
  }
};

/**
 * Upload Project Screenshot or Thumbnail
 * POST /media/upload/project
 */
export const uploadProjectMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No project screenshot provided.' });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'portfolio/projects',
      resource_type: 'image',
      transformation: [
        { width: 1600, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    const mediaRecord = await Media.create({
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      resource_type: 'image',
      bytes: uploadResult.bytes,
      folder: 'portfolio/projects',
      category: 'project',
      originalFilename: req.file.originalname,
      uploadedBy: req.username || 'admin',
    });

    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      media: mediaRecord,
    });
  } catch (error) {
    console.error('Project image upload error:', error);
    res.status(500).json({ message: error.message || 'Failed to upload project screenshot.' });
  }
};

/**
 * Delete Media Asset by Public ID
 * DELETE /media/delete
 */
export const deleteMedia = async (req, res) => {
  try {
    const { publicId, resourceType = 'image' } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: 'publicId is required to delete an asset.' });
    }

    const result = await deleteFromCloudinary(publicId, resourceType);
    await Media.findOneAndDelete({ public_id: publicId });

    res.status(200).json({
      success: true,
      message: 'Asset successfully deleted from Cloudinary and database.',
      result,
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete asset from Cloudinary.' });
  }
};

/**
 * List all managed Cloudinary assets
 * GET /media/list
 */
export const listMedia = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const mediaList = await Media.find(filter).sort({ createdAt: -1 }).limit(100);
    res.status(200).json(mediaList);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to retrieve media library.' });
  }
};
