import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'customer',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `profile-${Date.now()}-${file.originalname}`, // Generate unique filename
  },
});

const fileUpload = multer({ storage });

export default fileUpload;
