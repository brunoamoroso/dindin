import { Request, Response } from "express";
import { db } from "../db/conn";

export const getCategories = async (req: Request, res: Response) => {
  const { type } = req.params;
  const user = req.user;

  try {
    const queryCategories = `SELECT * FROM categories WHERE type = $1 AND (is_public = true OR created_by = $2)`;
    const value = [type, user];

    const { rows: categories } = await db.query(queryCategories, value);

    return res.status(200).json(categories);
  } catch (err: unknown) {
    console.log(err);
    return res
      .status(422)
      .send("Houve um erro ao buscar as categorias. Tente novamente.");
  }
};

export const getSubCategories = async (req: Request, res: Response) => {
  const { category } = req.params;
  const user = req.user;

  try {
    const querySubcategories = ` SELECT sub.*
    FROM subcategories as sub
    JOIN categories_subcategories as cs ON sub.id = cs.subcategory_id
    JOIN categories as cat ON cat.id = cs.category_id
    WHERE cat.description = $1 AND (sub.is_public = true OR sub.created_by = $2)
    `;
    const value = [category, user];

    const { rows: subcategories } = await db.query(querySubcategories, value);

    return res.status(200).json(subcategories);
  } catch (err: unknown) {
    console.log(err);
    return res
      .status(422)
      .json({
        message: "Não conseguimos encontrar nenhuma categoria nesse momento.",
      });
  }
};

export const getSearchCategories = async (req: Request, res: Response) => {
  const { type, query } = req.query;
  const user = req.user;

  if (type === null || type === undefined) {
    return res
      .status(400)
      .json({ message: "Não há tipo de categorias ou subcategorias definido" });
  }

  try {
    const querySearchCategories = `SELECT * 
    FROM categories
    WHERE type = $1 AND (is_public = true OR created_by = $2) AND description ILIKE $3`;

    const valuesSearchCategories = [type, user, `%${query}%`];

    const { rows: categories } = await db.query(querySearchCategories, valuesSearchCategories);

    const querySearchSubCategories = `SELECT sub.*, cat.id as category_id, cat.description as category_description
    FROM subcategories sub
    JOIN categories_subcategories cs ON sub.id = cs.subcategory_id
    JOIN categories cat ON cat.id = cs.category_id
    WHERE cat.type = $1 AND (sub.is_public = true OR sub.created_by = $2) AND sub.description ILIKE $3`;

    const valuesSearchSubCategories = [type, user, `%${query}%`];

    const { rows: subcategories } = await db.query(querySearchSubCategories, valuesSearchSubCategories);

    const categoriesFlagged = categories.map((cat) => ({...cat, isCategory: true}));
    const subCategoriesFlagged = subcategories.map((sub) => ({...sub, isCategory: false}));

    const combinedResults = [...categoriesFlagged, ...subCategoriesFlagged];

    return res.status(200).json(combinedResults);
  } catch (err) {
    console.error(err);
  }
};
