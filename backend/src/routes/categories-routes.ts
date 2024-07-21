import express from 'express';
import { getCategories } from '../controllers/categories-controller';

const categoriesRoutes = express.Router();

categoriesRoutes.get('/:type', getCategories);

export default categoriesRoutes;