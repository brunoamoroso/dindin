import express from 'express';
import { ChangePassword, CreateProfile, EditUserProfile, getAvatar, getUserProfile, SignIn } from '../controllers/profile-controller';
import imageUploader from '../utils/image-uploader';
import { checkToken } from '../utils/check-token';
import { uploadToSupabase } from '../utils/upload-to-supabase';

const profileRoutes = express.Router();

profileRoutes.post('/create', imageUploader.single('photo'), CreateProfile);
profileRoutes.post('/signin', SignIn);
profileRoutes.put('/edit', checkToken, imageUploader.single('photo'), EditUserProfile);
profileRoutes.post('/password/change', checkToken, ChangePassword);


profileRoutes.get('/avatar', checkToken, getAvatar);
profileRoutes.get('/user/data', checkToken, getUserProfile);

export default profileRoutes;