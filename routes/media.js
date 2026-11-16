import express from 'express';
import verifyJWT from '../middlewares/verifyJWT.js';
import { uploadImage, uploadPdf, uploadAnyMedia } from '../middlewares/uploadMiddleware.js';
import {
  uploadProfilePhoto,
  uploadResumePdf,
  uploadPostMedia,
  uploadProjectMedia,
  deleteMedia,
  listMedia,
} from '../controllers/mediaController.js';

const router = express.Router();

// All media upload and management endpoints require JWT authentication
router.use(verifyJWT);

// Upload routes
router.post('/upload/profile', uploadImage.single('image'), uploadProfilePhoto);
router.post('/upload/resume', uploadPdf.single('resume'), uploadResumePdf);
router.post('/upload/post', uploadImage.single('image'), uploadPostMedia);
router.post('/upload/project', uploadImage.single('image'), uploadProjectMedia);

// Delete & List routes
router.delete('/delete', deleteMedia);
router.get('/list', listMedia);

export default router;
