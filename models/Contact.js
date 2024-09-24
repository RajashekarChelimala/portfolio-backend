import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email is required"],trim: true },
  mobileNumber: { type: Number, required: [true, "Mobile Number is required"],trim: true },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
  },
}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
});

export default mongoose.model('Contact', contactSchema);
