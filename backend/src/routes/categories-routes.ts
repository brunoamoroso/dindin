import express from 'express';
import { createSubCategory, deleteSubCategory, editSubCategory, getCategories, getSearchCategories, getSubCategories } from '../controllers/categories-controller';
import { checkToken } from '../utils/check-token';

const categoriesRoutes = express.Router();

categoriesRoutes.get('/search', checkToken, getSearchCategories);
categoriesRoutes.get('/:type', checkToken, getCategories);
categoriesRoutes.get('/:category/sub', checkToken, getSubCategories);
categoriesRoutes.post('/:category/sub/create', checkToken, createSubCategory);
categoriesRoutes.put('/sub/edit/:id', checkToken, editSubCategory);
categoriesRoutes.delete('/sub/delete/:id', checkToken, deleteSubCategory);

export default categoriesRoutes;