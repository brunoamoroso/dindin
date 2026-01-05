import express from 'express';
import { GoogleAuth, GoogleAuthCallback, GoogleLinkAuthCallback, SignIn } from '../controllers/auth-controller';
import { checkToken } from '../utils/check-token';

const authRoutes = express.Router();

authRoutes.post('/signin', SignIn);
authRoutes.get('/google', GoogleAuth);
authRoutes.get('/google/link', checkToken, GoogleAuth);
authRoutes.get('/google/callback', GoogleAuthCallback);
authRoutes.get('/google/link/callback', GoogleLinkAuthCallback);

export default authRoutes;