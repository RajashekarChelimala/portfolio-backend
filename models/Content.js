import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hobbies: String,
    organization: String,
    designation: String,
    location: String,
    degree: String,
    education: String,
    languages: String,
    footerText: String,
    introduction: String,
    imageLink: String,
    resumeLink: String,
    typeWriterText: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    github: String,
  }, {
    timestamps: true // automatically adds createdAt and updatedAt fields
  });
  
  export default mongoose.model('Content', contentSchema);