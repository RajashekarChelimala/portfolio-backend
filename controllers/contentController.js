import Content from '../models/Content.js';

// GET: Fetch existing content
export const getContent = async (req, res) => {
    try {
      const content = await Content.findOne().lean(); // Using lean() to get a plain JavaScript object
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
  
      // Destructure to exclude fields
      const { createdAt, updatedAt, __v, ...contentWithoutMeta } = content;
  
      res.json(contentWithoutMeta); // Send response without the excluded fields
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  
// POST: Create new content
export const createContent = async (req, res) => {
  const {
    name,
    hobbies,
    organization,
    designation,
    location,
    degree,
    education,
    languages,
    footerText,
    introduction,
    imageLink,
    resumeLink,
    typeWriterText,
    instagram,
    twitter,
    linkedin,
    github,
  } = req.body;

  try {
    const newContent = new Content({
      name,
      hobbies,
      organization,
      designation,
      location,
      degree,
      education,
      languages,
      footerText,
      introduction,
      imageLink,
      resumeLink,
      typeWriterText,
      instagram,
      twitter,
      linkedin,
      github,
    });

    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating content' });
  }
};

// PUT: Update existing content
export const updateContent = async (req, res) => {
  const {
    name,
    hobbies,
    organization,
    designation,
    location,
    degree,
    education,
    languages,
    footerText,
    introduction,
    imageLink,
    resumeLink,
    typeWriterText,
    instagram,
    twitter,
    linkedin,
    github,
  } = req.body;

  try {
    const content = await Content.findOne(); // Fetch the first content entry
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Update fields
    content.name = name;
    content.hobbies = hobbies;
    content.organization = organization;
    content.designation = designation;
    content.location = location;
    content.degree = degree;
    content.education = education;
    content.languages = languages;
    content.footerText = footerText;
    content.introduction = introduction;
    content.imageLink = imageLink;
    content.resumeLink = resumeLink;
    content.typeWriterText = typeWriterText;
    content.instagram = instagram;
    content.twitter = twitter;
    content.linkedin = linkedin;
    content.github = github 

    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating content' });
  }
};
