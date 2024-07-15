import express from 'express';
import { CreateProfile } from '../controllers/profile-controller';
import imageUploader from '../utils/imageUploader';

const profileRoutes = express.Router();

profileRoutes.post('/create', imageUploader.single('photo'), CreateProfile);

export default profileRoutes;