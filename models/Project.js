import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Array of Skill references
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',  // Referencing the Skill model
    required: true,
  }],
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
  },
  currentlyWorking: {
    type: Boolean,
    required: true,
  },
  projectLink: {
    type: String,
    required: true,
  },
  organizationName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
