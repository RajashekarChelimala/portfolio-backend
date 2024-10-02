import Skill from '../models/Skill.js';

// Create a new skill
export const createSkill = async (req, res) => {
  try {
    const { name, icon, type, priorityOrder, description, experience, certificateLink, organizationName } = req.body;

    // Validation
    if (!name || !type || !priorityOrder|| !experience || !organizationName) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create new skill
    const newSkill = new Skill({
      name,
      type,
      priorityOrder,
      icon,
      description,
      experience,
      certificateLink,
      organizationName
    });

    // Save to the database
    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all skills
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single skill by ID
export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a skill by ID
export const updateSkill = async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(req.body.id, req.body, { new: true });
    if (!updatedSkill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a skill by ID
export const deleteSkill = async (req, res) => {
  try {
    const deletedskill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedskill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
