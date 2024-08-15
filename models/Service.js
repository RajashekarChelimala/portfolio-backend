import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  iconName: { type: String, required: true },
  targetUrl: { type: String, required: true },
  displayOrder: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
});

export default mongoose.model('Service', serviceSchema);
