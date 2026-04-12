import express from 'express';
import { GoogleAuth, GoogleAuthCallback, GoogleLinkAuth, GoogleLinkAuthCallback, GoogleLinkAuthStart, GoogleUnlink, SignIn } from '../controllers/auth-controller';
import { checkToken } from '../utils/check-token';

const authRoutes = express.Router();

authRoutes.post('/signin', SignIn);
authRoutes.get('/google', GoogleAuth);
authRoutes.get('/google/link', checkToken, GoogleLinkAuth);
authRoutes.get('/google/link/start', GoogleLinkAuthStart);
authRoutes.get('/google/callback', GoogleAuthCallback);
authRoutes.get('/google/link/callback', GoogleLinkAuthCallback);
authRoutes.post('/google/unlink', checkToken, GoogleUnlink);

export default authRoutes;
