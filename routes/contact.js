import express from "express";
import { handleNewContact, getAllContact, deleteContact, getContact, sendEmail } from "../controllers/contactController.js";
import multer from 'multer';
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

// Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define routes
router.route('/')
    .post(handleNewContact)     // Public route for adding new contact
    .get(verifyJWT, getAllContact);  // Protected route for getting all contacts (JWT required)

router.route('/:id')
    .get(verifyJWT, getContact)      // Protected route for getting a contact by ID (JWT required)
    .delete(verifyJWT, deleteContact);  // Protected route for deleting a contact (JWT required)

// Email sending route for multiple attachments (JWT required)
router.post('/send-email', verifyJWT, upload.array('attachments'), sendEmail);

export default router;
