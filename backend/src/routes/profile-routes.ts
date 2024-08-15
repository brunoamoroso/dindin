import express from 'express';
import { CreateProfile, SignIn } from '../controllers/profile-controller';
import imageUploader from '../utils/image-uploader';

const profileRoutes = express.Router();

profileRoutes.post('/create', imageUploader.single('photo'), CreateProfile);
profileRoutes.post('/signin', SignIn);

export default profileRoutes;