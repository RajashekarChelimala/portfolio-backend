import Contact from "../models/Contact.js";

export const getAllContact = async (req, res) => {
  const contacts = await Contact.find();
  if (!contacts) return res.status(204).json({ message: "No contacts found." });
  res.json(contacts);
};

export const handleNewContact = async (req, res) => {
    try {
      // Destructure the request body
      console.log("controller::" + req.body);
      const { email, mobileNumber, message } = req.body;
  
      // Check if all required fields are present
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      } else if (!mobileNumber) {
        return res.status(400).json({ error: "Mobile is required" });
      } else if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
  
      // Create a new Contact document
      const newContact = new Contact({
        email,
        mobileNumber,
        message,
      });
  
      // Save the Contact to the database
      const savedContact = await newContact.save();
  
      // Send a response with the created Contact
      res.status(201).json(savedContact);
    } catch (error) {
      // Handle any errors that occurred during the process
      res.status(500).json({ error: error.message });
    }
  };