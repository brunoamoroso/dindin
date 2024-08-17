import express from 'express';
import { getCategories, getSubCategories } from '../controllers/categories-controller';
import { checkToken } from '../utils/check-token';

const categoriesRoutes = express.Router();

categoriesRoutes.get('/:type', checkToken, getCategories);
categoriesRoutes.get('/sub/:category', getSubCategories);

export default categoriesRoutes;