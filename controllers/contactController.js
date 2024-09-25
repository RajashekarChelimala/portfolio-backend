import Contact from "../models/Contact.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to handle email sending
export const sendEmail = async (req, res) => {
  const { subject, body, to } = req.body;
  const attachments = req.files; // This will be populated by multer

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body,
    };

    // If there are attachments, add them to the email options
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map(attachment => ({
        filename: attachment.originalname,
        content: attachment.buffer,
      }));
    }

    // Send the email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Error sending email' });
  }
};

export const getAllContact = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  if (!contacts) return res.status(204).json({ message: "No contacts found." });
  res.json(contacts);
};

export const handleNewContact = async (req, res) => {
  try {
    // Destructure the request body
    console.log("controller::" + req.body);
    const { name, email, mobileNumber, message } = req.body;

    // Check if all required fields are present
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    } else if (!mobileNumber) {
      return res.status(400).json({ error: "Mobile is required" });
    } else if (!message) {
      return res.status(400).json({ error: "Message is required" });
    } else if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Create a new Contact document
    const newContact = new Contact({
      name,
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

// Delete a specific contact by ID
export const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact)
      return res.status(404).json({ message: "Contact not found" });
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
