import express from 'express';
import { CreateProfile, EditUserProfile, getAvatar, getUserProfile, SignIn } from '../controllers/profile-controller';
import imageUploader from '../utils/image-uploader';
import { checkToken } from '../utils/check-token';

const profileRoutes = express.Router();

profileRoutes.post('/create', imageUploader.single('photo'), CreateProfile);
profileRoutes.post('/signin', SignIn);
profileRoutes.put('/edit', checkToken, imageUploader.single('photo'), EditUserProfile);

profileRoutes.get('/avatar', checkToken, getAvatar);
profileRoutes.get('/userData', checkToken, getUserProfile);

export default profileRoutes;