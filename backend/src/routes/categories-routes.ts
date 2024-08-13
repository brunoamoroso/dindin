import express from 'express';
import { getCategories, getSubCategories } from '../controllers/categories-controller';

const categoriesRoutes = express.Router();

categoriesRoutes.get('/:type', getCategories);
categoriesRoutes.get('/sub/:category', getSubCategories);

export default categoriesRoutes;