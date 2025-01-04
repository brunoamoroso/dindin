import express from 'express';
import { CreateProfile, getAvatar, SignIn } from '../controllers/profile-controller';
import imageUploader from '../utils/image-uploader';
import { checkToken } from '../utils/check-token';

const profileRoutes = express.Router();

profileRoutes.post('/create', imageUploader.single('photo'), CreateProfile);
profileRoutes.post('/signin', SignIn);
profileRoutes.get('/avatar', checkToken, getAvatar);

export default profileRoutes;