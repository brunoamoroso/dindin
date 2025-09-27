import { Request, Response } from "express";
import { db } from "../db/conn";
import { toPostgresDate } from "../utils/to-postgres-date";

export const createLimit = async (req: Request, res: Response) => {
  const user = req.user;
  const { amount, selectedDate, coinSelected, category_id } = req.body;

  try {
    const queryCreateLimit = `INSERT INTO expense_limits (coin_id, category_id, amount_limit, created_by, created_at)
        VALUES ((SELECT id FROM coins WHERE code = $1), (SELECT id FROM categories WHERE id = $2), $3, $4, $5)`;

    const valuesCreateLimit = [
      coinSelected,
      category_id,
      amount,
      user,
      selectedDate,
    ];

    await db.query(queryCreateLimit, valuesCreateLimit);

    const date = new Date(selectedDate);

    const startDate = toPostgresDate(
      new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
    );
    const endDate = toPostgresDate(
      new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString()
    );

    const queryUpdateLimitsSpentAmount = `UPDATE expense_limits el
        SET amount_spent = subquery.spent_amount
        FROM (
            SELECT SUM(t.amount) AS spent_amount, t.category_id
            FROM transactions t
            JOIN coins c ON c.id = t.coin_id
            WHERE t.type = 'expense' AND t.created_by = $1 AND t.date BETWEEN $2 AND $3 AND c.code = $4
            GROUP BY t.category_id
        ) AS subquery
        WHERE el.category_id = subquery.category_id AND el.created_by = $1 AND el.created_at BETWEEN $2 AND $3 AND el.coin_id = (SELECT id FROM coins WHERE code = $4)`;

    const valuesUpdateLimitsSpentAmount = [
      user,
      startDate,
      endDate,
      coinSelected,
    ];

    await db.query(queryUpdateLimitsSpentAmount, valuesUpdateLimitsSpentAmount);

    res.status(201).send({ message: "Limit created successfully" });
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
