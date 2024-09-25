import express from "express";
import { handleNewContact, getAllContact, deleteContact, getContact, sendEmail } from "../controllers/contactController.js";
import multer from 'multer';

const router = express.Router();

// Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define routes
router.route('/')
    .post(handleNewContact)
    .get(getAllContact);

router.route('/:id')
    .get(getContact)
    .delete(deleteContact);

// Email sending route for multiple attachments
router.post('/send-email', upload.array('attachments'), sendEmail);

export default router;
