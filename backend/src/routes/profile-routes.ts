import express from 'express';
import { ChangePassword, CheckEmailExists, CheckPassword, CreateProfile, EditUserProfile, getUserProfile } from '../controllers/profile-controller';
import imageUploader from '../utils/image-uploader';
import { checkToken } from '../utils/check-token';

const profileRoutes = express.Router();

profileRoutes.post('/create', imageUploader.single('photo'), CreateProfile);
profileRoutes.post('/check-email', CheckEmailExists);
profileRoutes.put('/edit', checkToken, imageUploader.single('photo'), EditUserProfile);
profileRoutes.post('/change-password', checkToken, ChangePassword);
profileRoutes.get('/check-password', checkToken, CheckPassword);


profileRoutes.get('/user/data', checkToken, getUserProfile);

export default profileRoutes;