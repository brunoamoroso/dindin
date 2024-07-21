import express from 'express';

const categoriesRoutes = express.Router();

categoriesRoutes.get('/:type', (req, res) => {
    const {type} = req.params;
    console.log(type);
});

export default categoriesRoutes;