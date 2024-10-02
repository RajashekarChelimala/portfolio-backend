import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  priorityOrder: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    required: false,
  },
  experience: {
    type: String,
    required: true,
  },
  certificateLink: {
    type: String,
    required: false,
  },
  organizationName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;