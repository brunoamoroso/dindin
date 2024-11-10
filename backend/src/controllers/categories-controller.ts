import { Request, Response } from "express";
import clientDB from "../db/conn";
import e from "../db/dbschema/edgeql-js";
import { subCategory, User } from "../db/dbschema/edgeql-js/modules/default";

export const getCategories = async (req: Request, res: Response) => {
  const { type } = req.params;

  try {
    const queryCategories = e.select(e.Category, (category) => {
      const createdByUser = e.op(
        category.created_by.id,
        "=",
        e.uuid(req.user as string)
      );
      const createdBySystem = e.op(category.is_public, "=", true);
      const filterType = e.op(category.type, "=", e.cast(e.CategoryType, type));

      return {
        id: true,
        desc: true,
        filter: e.op(
          filterType,
          "and",
          e.op(createdBySystem, "or", createdByUser)
        ),
      };
    });

    const categories = await queryCategories.run(clientDB);

    return res.status(200).send(categories);
  } catch (err: unknown) {
    console.log(err);
    return res
      .status(422)
      .send("Não conseguimos encontrar nenhuma categoria nesse momento.");
  }
};

export const getSubCategories = async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const querySubcategories = e.select(e.Category, (cat) => {
      const createdByUser = e.op(
        cat.created_by.id,
        "=",
        e.uuid(req.user as string)
      );
      const createdBySystem = e.op(cat.is_public, "=", true);

      return {
        subCategories: () => ({
          id: true,
          desc: true,
          filter: e.op(createdBySystem, "or", createdByUser),
        }),
        filter: e.op(cat.desc, "=", category),
      };
    });

    const subCategories = await querySubcategories.run(clientDB);
    res.status(200).json(subCategories[0].subCategories);
    return;
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

  if (type === null || type === undefined) {
    return res
      .status(400)
      .json({ message: "Não há tipo de categorias ou subcategorias definido" });
  }

  try {
    const querySearchCategories = e.select(e.Category, (cat) => {
      const createdByUser = e.op(
        cat.created_by.id,
        "=",
        e.uuid(req.user as string)
      );
      const createdBySystem = e.op(cat.is_public, "=", true);
      const filterType = e.op(
        cat.type,
        "=",
        e.cast(e.CategoryType, type as string)
      );
      const filterQuery = e.op(cat.desc, "ilike", "%" + query + "%");

      return {
        id: true,
        desc: true,
        subCategories: sub => ({
          id: true,
          desc: true,
          filter: e.op(
            e.op(sub.desc, "ilike", "%" + query + "%"),
            "and",
            e.op(createdBySystem, "or", createdByUser)
          ),
        }),
        filter: e.op(
          e.op(filterType, "and", filterQuery),
          "and",
          e.op(createdBySystem, "or", createdByUser)
        ),
      };
    });

    const runSearchCategories = await querySearchCategories.run(clientDB);

    const querySearchSubCategories = e.select(e.subCategory, (sub) => {
      const createdByUser = e.op(
        sub.created_by.id,
        "=",
        e.uuid(req.user as string)
      );
      const createdBySystem = e.op(sub.is_public, "=", true);
      const categoryTypeFilter = e.cast(e.CategoryType, type as string);
      const filterType = e.op(sub["<subCategories[is Category]"].type, "=", categoryTypeFilter);
      const filterQuery = e.op(sub.desc, "ilike", "%" + query + "%");

      return {
        id: true,
        desc: true,
        category: e.select(sub["<subCategories[is Category]"], (cat) => ({
          id: true,
          desc: true
        })),
        filter: e.op(
          e.op(filterType, "and", filterQuery),
          "and",
          e.op(createdBySystem, "or", createdByUser)
        ),
      };
    });

    const runSearchSubCategories = await querySearchSubCategories.run(clientDB);

    const categoriesFlagged = runSearchCategories.map((cat) => ({...cat, isCategory: true}));
    const subCategoriesFlagged = runSearchSubCategories.map((sub) => ({...sub, isCategory: false}));

    const combinedResults = [...categoriesFlagged, ...subCategoriesFlagged];

    return res.status(200).json(combinedResults)
  } catch (err) {
    console.error(err);
  }
};
