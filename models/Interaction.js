import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  visitorId: String,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  liked: { type: Boolean, default: false },
  engaged: { type: Boolean, default: false },
  ipAddress: { type: String },
},{
  timestamps: true, // automatically adds createdAt and updatedAt fields
});

const Interaction = mongoose.model('Interaction', interactionSchema);
export default Interaction;