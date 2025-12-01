import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Use memory storage to get file buffer for base64 conversion
const storage = multer.memoryStorage();

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/i;
  const allowedVideoTypes = /mp4|avi|mov|mkv|webm|flv/i;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;
  
  if (allowedImageTypes.test(ext) || allowedImageTypes.test(mimeType)) {
    cb(null, true);
  } else if (allowedVideoTypes.test(ext) || allowedVideoTypes.test(mimeType)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

// Create multer upload instance with 10MB limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Helper function to convert file buffer to base64 data URL
export const fileToBase64 = (file) => {
  if (!file || !file.buffer) return null;
  const base64 = file.buffer.toString('base64');
  const mimeType = file.mimetype;
  return `data:${mimeType};base64,${base64}`;
};

// Helper function to check if a string is a base64 data URL
export const isBase64Image = (str) => {
  if (!str) return false;
  return str.startsWith('data:image/') || str.startsWith('data:video/');
};

export default upload;
