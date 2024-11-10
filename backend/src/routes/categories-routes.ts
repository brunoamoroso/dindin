import express from 'express';
import { getCategories, getSearchCategories, getSubCategories } from '../controllers/categories-controller';
import { checkToken } from '../utils/check-token';

const categoriesRoutes = express.Router();

categoriesRoutes.get('/search', checkToken, getSearchCategories);
categoriesRoutes.get('/:type', checkToken, getCategories);
categoriesRoutes.get('/sub/:category', checkToken, getSubCategories);

export default categoriesRoutes;