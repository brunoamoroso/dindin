import express from 'express';
import { CreateProfile } from '../../controllers/profile-controller';

const router = express.Router();

router.post('/create-profile', CreateProfile);

export default router;