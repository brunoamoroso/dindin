import { Request, Response } from "express";
import { db } from "../db/conn";
import { toPostgresDate } from "../utils/to-postgres-date";

export const createLimit = async (req: Request, res: Response) => {
  const user = req.user;
  const { amount, selectedDate, coinSelected, category_id } = req.body;

  const date = new Date(selectedDate);
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), 1);

  try {
    const queryCreateLimit = `
      INSERT INTO expense_limits(coin_id, category_id, amount_limit, amount_spent, created_by, created_at)
      SELECT 
        c.id as coin_id, 
        $2 as category_id, 
        $3 as amount_limit,
        COALESCE((
          SELECT SUM(t.amount)
          FROM transactions t
          WHERE t.type = 'expense'
            AND t.coin_id = c.id
            AND t.category_id = $2
            AND t.created_by = $4
            AND t.date >= date_trunc('month', $5::date)
            AND t.date <  (date_trunc('month', $5::date) + INTERVAL '1 month')
        ), 0) AS amount_spent,
        $4 as created_by, 
        $5 as created_at
      FROM coins c
      WHERE c.code = $1
      RETURNING *`;
    

    const valuesCreateLimit = [
      coinSelected,
      category_id,
      amount,
      user,
      normalizedDate,
    ];

    await db.query(queryCreateLimit, valuesCreateLimit);

    res.status(201).send({ message: "Limit created successfully" });
  } catch (err: unknown) {
    console.error(err);
    const message = (err instanceof Error && err.message) || "Erro inesperado";
    return res.status(422).json({ message: message });
  }
};

export const getLimitById = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  
  try {
    const queryGetLimitById = `
    SELECT el.amount_limit, el.category_id, cat.description AS category, c.code, el.created_at
    FROM expense_limits el
    JOIN coins c ON c.id = el.coin_id
    JOIN categories cat ON cat.id = el.category_id
    WHERE el.id = $1 AND el.created_by = $2`;
    const valuesGetLimitById = [id, user];

    const { rows } = await db.query(queryGetLimitById, valuesGetLimitById);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Limit not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (err: unknown) {
    console.error(err);
    const message = (err instanceof Error && err.message) || "Erro inesperado";
    return res.status(422).json({ message: message });
  }
};

export const getLimits = async (req: Request, res: Response) => {
  const user = req.user;
  const { selectedDate, coinSelected } = req.params;
  const date = new Date(selectedDate);

  const startDate = toPostgresDate(
    new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
  );
  const endDate = toPostgresDate(
    new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString()
  );

  try {
    const queryGetLimits = `SELECT el.id, el.amount_limit, el.amount_spent, cat.description AS category
        FROM expense_limits el
        JOIN categories cat ON cat.id = el.category_id
        JOIN coins co ON co.id = el.coin_id
        WHERE el.created_by = $1 AND el.created_at BETWEEN $2 AND $3 AND co.code = $4
        ORDER BY el.created_at DESC`;

    const valuesGetLimits = [user, startDate, endDate, coinSelected];

    const { rows } = await db.query(queryGetLimits, valuesGetLimits);

    return res.status(200).json(rows);
  } catch (err: unknown) {
    console.error(err);
    const message = (err instanceof Error && err.message) || "Erro inesperado";
    return res.status(422).json({ message: message });
  }
};

export const deleteLimit = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const queryDeleteLimit = `DELETE FROM expense_limits WHERE id = $1 AND created_by = $2`;
    const valuesDeleteLimit = [id, user];

    await db.query(queryDeleteLimit, valuesDeleteLimit);

    res.status(200).send({ message: "Limit deleted successfully" });
  } catch (err: unknown) {
    console.error(err);
    const message = (err instanceof Error && err.message) || "Erro inesperado";
    return res.status(422).json({ message: message });
  }
}

export const updateLimit = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const { amount, selectedDate, coinSelected, category_id } = req.body;

  try {
    const queryUpdateLimit = `
      UPDATE expense_limits 
      SET coin_id = (SELECT id FROM coins WHERE code = $1), 
          category_id = (SELECT id FROM categories WHERE id = $2), 
          amount_limit = $3,
          amount_spent = COALESCE((
            SELECT SUM(t.amount)
            FROM transactions t
            JOIN coins c ON c.id = t.coin_id
            WHERE t.type = 'expense'
              AND t.category_id = $2
              AND t.created_by = $5
              AND c.code = $1
              AND t.date >= (SELECT date_trunc('month', $6::date))
              AND t.date < (SELECT (date_trunc('month', $6::date) + INTERVAL '1 month'))
          ), 0)

      WHERE id = $4 
      RETURNING *`;

    const valuesUpdateLimit = [
      coinSelected,
      category_id,
      amount,
      id,
      user,
      selectedDate
    ];

    await db.query(queryUpdateLimit, valuesUpdateLimit);

    return res.status(200).send({ message: "Limit updated successfully" });
  } catch (err: unknown) {
    console.error(err);
    const message = (err instanceof Error && err.message) || "Erro inesperado";
    return res.status(422).json({ message: message });
  }
};
