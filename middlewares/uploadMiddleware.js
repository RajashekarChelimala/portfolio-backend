import multer from 'multer';

// Use memory storage so we can directly stream to Cloudinary without saving temp files on disk
const storage = multer.memoryStorage();

// File filter for images (JPEG, PNG, WEBP, GIF, SVG)
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Allowed: JPEG, PNG, WEBP, GIF, SVG'), false);
  }
};

// File filter for documents & PDFs
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid document type. Only PDF files are supported.'), false);
  }
};

// Multer upload instances with limits
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB image limit
});

export const uploadPdf = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB PDF limit
});

export const uploadAnyMedia = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});
