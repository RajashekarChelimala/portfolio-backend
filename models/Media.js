import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      default: '',
    },
    resource_type: {
      type: String,
      default: 'image',
    },
    bytes: {
      type: Number,
      default: 0,
    },
    folder: {
      type: String,
      default: 'portfolio',
    },
    category: {
      type: String,
      enum: ['profile', 'resume', 'post-cover', 'post-content', 'project', 'attachment'],
      default: 'attachment',
    },
    originalFilename: {
      type: String,
      default: '',
    },
    uploadedBy: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Media', mediaSchema);
