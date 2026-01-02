import express from 'express';
import { GoogleAuth, GoogleAuthCallback } from '../controllers/auth-controller';

const authRoutes = express.Router();

authRoutes.get('/google', GoogleAuth);
authRoutes.get('/google/callback', GoogleAuthCallback);

export default authRoutes;