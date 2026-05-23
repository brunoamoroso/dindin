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
    console.error(err);
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
    console.error(err);
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
    WHERE type = $1 AND (is_public = true OR created_by = $2) AND unaccent(description) ILIKE unaccent($3)`;

    const valuesSearchCategories = [type, user, `%${query}%`];

    const { rows: categories } = await db.query(querySearchCategories, valuesSearchCategories);

    const querySearchSubCategories = `SELECT sub.*, cat.id as category_id, cat.description as category_description
    FROM subcategories sub
    JOIN categories_subcategories cs ON sub.id = cs.subcategory_id
    JOIN categories cat ON cat.id = cs.category_id
    WHERE cat.type = $1 AND (sub.is_public = true OR sub.created_by = $2) AND unaccent(sub.description) ILIKE unaccent($3)`;

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

export const createSubCategory = async (req: Request, res: Response) => {
  const { description } = req.body;
  const { category } = req.params;
  const user = req.user;

  try{
    if (description === null || description === undefined || description.trim() === ""){
      return res.status(400).json({ message: "A descrição da subcategoria é obrigatória." });
    }

    if (category === null || category === undefined || category.trim() === ""){
      return res.status(400).json({ message: "A categoria é obrigatória para criar uma subcategoria." });
    }

    const queryInsertSubCategory = `
    WITH new_subcategory AS (
      INSERT INTO subcategories (description, is_public, created_by) 
      VALUES ($1, $2, $3) 
      RETURNING id
    ),
    link_category_sub AS (
      INSERT INTO categories_subcategories (category_id, subcategory_id)
      SELECT id, (SELECT id FROM new_subcategory) FROM categories WHERE description = $4
    )
      SELECT id FROM new_subcategory;
    `;
    const valuesInsertSubCategory = [description, false, user, category];

    const { rows } = await db.query(queryInsertSubCategory, valuesInsertSubCategory);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Houve um erro ao criar a subcategoria." });
  }
}

export const editSubCategory = async (req: Request, res: Response) => {
  const { description } = req.body;
  const { id } = req.params;
  const user = req.user;

  try{
    if (description === null || description === undefined || description.trim() === ""){
      return res.status(422).json({ message: "A descrição da subcategoria é obrigatória." });
    }

    if (id === null || id === undefined || id.trim() === ""){
      return res.status(422).json({ message: "O ID da subcategoria é obrigatório para editá-la." });
    }

    const queryEditSubCategory = `
    UPDATE subcategories 
    SET description = $1 
    WHERE id = $2 AND created_by = $3
    RETURNING id;
    `;
    const valuesEditSubCategory = [description, id, user];

    const { rows } = await db.query(queryEditSubCategory, valuesEditSubCategory);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Subcategoria não encontrada ou você não tem permissão para editá-la." });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Houve um erro ao editar a subcategoria." });
  }
}

export const deleteSubCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  try{
    if (id === null || id === undefined || id.trim() === ""){
      return res.status(422).json({ message: "O ID da subcategoria é obrigatório para deletá-la." });
    }

    const queryDeleteSubCategory = ` WITH delete_category_subcategory_link AS (
      DELETE FROM categories_subcategories
      WHERE subcategory_id = $1
    ),
    delete_subcategory AS (
      DELETE FROM subcategories 
      WHERE id = $1 AND created_by = $2
      RETURNING id
    )
    SELECT id FROM delete_subcategory;
    `;
    const valuesDeleteSubCategory = [id, user];

    const { rows } = await db.query(queryDeleteSubCategory, valuesDeleteSubCategory);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Subcategoria não encontrada ou você não tem permissão para deletá-la." });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Houve um erro ao deletar a subcategoria." });
  }
}
