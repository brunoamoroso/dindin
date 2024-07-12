import express from 'express';
import { CreateProfile } from '../controllers/profile-controller';

const profileRoutes = express.Router();

profileRoutes.post('/create', CreateProfile);

export default profileRoutes;