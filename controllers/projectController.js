import Project from '../models/Project.js';
import Skill from '../models/Skill.js'; // Import Skill model

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { projectName, description, skills, fromDate, toDate, currentlyWorking, projectLink, organizationName } = req.body;

    // Validation
    if (!projectName || !description || !skills || !fromDate || (!currentlyWorking && !toDate) || !projectLink || !organizationName) {
      return res.status(400).json({ error: "All fields except 'toDate' when currently working are required." });
    }

    // Validate if skills are valid ObjectIds
    const skillIds = await Skill.find({ _id: { $in: skills } });
    if (skillIds.length !== skills.length) {
      return res.status(400).json({ error: "One or more skills are invalid." });
    }

    // Create new project
    const newProject = new Project({
      projectName,
      description,
      skills,  // This should be an array of Skill ObjectIds
      fromDate,
      toDate,
      currentlyWorking,
      projectLink,
      organizationName
    });

    // Save to the database
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    // Populate the 'skills' field to get full skill details
    const projects = await Project.find().populate('skills');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single project by ID
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('skills');
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a project by ID
export const updateProject = async (req, res) => {
  try {
    const { id, skills } = req.body;

    // Validate if skills are valid ObjectIds
    if (skills) {
      const skillIds = await Skill.find({ _id: { $in: skills } });
      if (skillIds.length !== skills.length) {
        return res.status(400).json({ error: "One or more skills are invalid." });
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true }).populate('skills');
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a project by ID
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
