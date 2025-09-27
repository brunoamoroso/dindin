import { Request, Response } from "express";
import { db } from "../db/conn";
import { toPostgresDate } from "../utils/to-postgres-date";
import splitInstallments from "../utils/split-installments";

export const addTransaction = async (req: Request, res: Response) => {
  const {
    coin,
    type,
    amount,
    description,
    category_id,
    subcategory_id,
    account_id,
    date,
    paymentCondition,
  } = req.body;
  let localDate = toPostgresDate(date.value);
  const installments = parseInt(req.body.installments);

  try {
    if (type === "gain") {
      const queryGainTransaction = `INSERT INTO transactions (coin_id, type, description, amount, account_id, category_id, subcategory_id, date, created_by)
      VALUES ((SELECT id FROM coins c WHERE c.code = $1),
      $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
      const valuesGainTransaction = [coin, type, description, amount, account_id, category_id, subcategory_id || null, localDate, req.user];

      const {rows: gainTransaction} = await db.query(queryGainTransaction, valuesGainTransaction);
      res.status(201).json(gainTransaction);
      return;
    }


    if (paymentCondition === undefined) {
      return res
        .status(422)
        .json({ message: "Payment Condition is mandatory" });
    }

    let queryExpenseTransaction;
    let expenseValues;

    if (type === "expense" && paymentCondition === "single") {
      queryExpenseTransaction = `
      WITH ins AS (
        INSERT INTO transactions (coin_id, type, description, amount, account_id, category_id, subcategory_id, date, payment_condition, created_by)
        VALUES ((SELECT id FROM coins c WHERE c.code = $1),$2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *
      ),
      upd AS(
        UPDATE expense_limits el
        SET amount_spent = el.amount_spent + ins.amount 
        FROM ins
        WHERE el.created_by = ins.created_by
          AND el.coin_id = ins.coin_id
          AND el.category_id = ins.category_id
          AND el.created_at BETWEEN (DATE_TRUNC('month', ins.date::date)) AND (DATE_TRUNC('month', ins.date::date) + INTERVAL '1 month - 1 day')
      )
      SELECT * FROM ins`;

      expenseValues = [coin, type, description, amount, account_id, category_id, subcategory_id || null, localDate, paymentCondition, req.user];

      const {rows: expenseTransaction} = await db.query(queryExpenseTransaction, expenseValues);

      return res.status(201).json(expenseTransaction);
    }

    if (type === "expense" && paymentCondition === "multi"){
      const amountSplit = splitInstallments({ amount, installments }); // in cents
      const {rows: uuid} = await db.query("SELECT gen_random_uuid()");
      const groupInstallmentId = uuid[0].gen_random_uuid;

      const bulkTransactions = Array.from({ length: installments }, (_, i) => {
        // create and array of objects of the transactions
        if (i > 0) {
          const dateIncrease = new Date(date.value);
          if (dateIncrease.getDate() === 31) {
            // +1 because 0 returns the last day from the previous month
            dateIncrease.setFullYear(
              dateIncrease.getFullYear(),
              dateIncrease.getMonth() + (i + 1),
              0
            );
          } else {
            dateIncrease.setMonth(dateIncrease.getMonth() + i);
          }
          localDate = toPostgresDate(dateIncrease.toISOString());
        }

        return {
          coin: coin, 
          type: "expense", 
          description: description, 
          amount: amountSplit[i],
          account: account_id,
          category: category_id,
          subCategory: subcategory_id || null,
          date: localDate,
          payment_condition: paymentCondition,
          install_number: i + 1,
          installments: installments,
          group_installment_id: groupInstallmentId,
          created_by: req.user
        };
      });

      //Convert the bulk transactions into a flat array, did like this to keep a better readability and maintainability
      const valuesAddTransaction = bulkTransactions.flatMap(obj => [
        obj.coin,
        obj.type,
        obj.description,
        obj.amount,
        obj.account,
        obj.category,
        obj.subCategory,
        obj.date,
        obj.payment_condition,
        obj.install_number,
        obj.installments,
        obj.group_installment_id,
        obj.created_by
      ]);

      
      const valuesPlaceholder = Array.from({length: bulkTransactions.length}, (_, i) => {
        return `((SELECT id FROM coins c WHERE c.code = $${i * 13 + 1}), $${i * 13 + 2}, $${i * 13 + 3}, $${i * 13 + 4}, $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, $${i * 13 + 9}, $${i * 13 + 10}, $${i * 13 + 11}, $${i * 13 + 12}, $${i * 13 + 13})`;
      }).join(", ");
      
      queryExpenseTransaction = `
      WITH ins AS (
        INSERT INTO transactions (coin_id, type, description, amount, account_id,
        category_id, subcategory_id, date, payment_condition, install_number, installments, group_installment_id, created_by)
        VALUES ${valuesPlaceholder}
        RETURNING amount, category_id, coin_id, created_by, date
      ),
      agg AS (
        SELECT category_id, coin_id, created_by, date_trunc('month', date::date) AS month_start, SUM(amount) AS total_amount
        FROM ins
        GROUP BY category_id, coin_id, created_by, month_start
      ),
      upd AS (
        UPDATE expense_limits el
        SET amount_spent = el.amount_spent + agg.total_amount
        FROM agg
        WHERE el.category_id = agg.category_id
          AND el.coin_id = agg.coin_id
          AND el.created_by = agg.created_by
          AND el.created_at BETWEEN agg.month_start AND (agg.month_start + INTERVAL '1 month - 1 day')::date
        RETURNING *
      )
      SELECT * FROM ins`;

      const {rows: expenseTransaction} = await db.query(queryExpenseTransaction, valuesAddTransaction);

      return res.status(201).json(expenseTransaction);
    }
  } catch (err) {
    res.status(422).json({ message: "Couldn't create the transaction" });
    console.error(err);
  }
};

export const getAllTransactionsByMonth = async (
  req: Request,
  res: Response
) => {
  const { selectedDate, coinSelected } = req.params;
  const date = new Date(selectedDate);
  const createStartDate = toPostgresDate(new Date(date.getFullYear(), date.getMonth(), 1).toISOString());
  const createEndDate = toPostgresDate(new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).toISOString());

  try {
    let queryAllTransactionsByMonth = `SELECT t.id, t.type, t.description, t.amount, t.account_id, acc.description AS account, t.category_id, t.subcategory_id, t.date,
    cat.description AS category, sub.description AS subcategory, t.installments, t.install_number, c.code
    FROM transactions t
    JOIN users u ON t.created_by = u.id
    JOIN coins c ON c.id = t.coin_id
    JOIN user_selected_coins usc ON usc.user_id = u.id AND usc.coin_id = t.coin_id
    LEFT JOIN accounts acc ON t.account_id = acc.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    LEFT JOIN subcategories sub ON t.subcategory_id = sub.id
    WHERE t.created_by = $1 AND t.date BETWEEN $2 AND $3
    `;

    const valuesAllTransactionsByMonth = [req.user, createStartDate, createEndDate];

    if(coinSelected !== "global" && coinSelected !== undefined) {
      queryAllTransactionsByMonth += ` AND c.code = $4`;
      valuesAllTransactionsByMonth.push(coinSelected);
    }

    queryAllTransactionsByMonth += ` ORDER BY t.date DESC`;

    const {rows: allTransactionsByMonth} = await db.query(queryAllTransactionsByMonth, valuesAllTransactionsByMonth);

    const sumAllAmountGained = allTransactionsByMonth.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === "gain") {
          return accumulator + currentValue.amount;
        }
        return accumulator;
      },
      0
    );

    const sumAllAmountExpend = allTransactionsByMonth.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === "expense") {
          return accumulator + currentValue.amount;
        }
        return accumulator;
      },
      0
    );

    return res
      .status(200)
      .json({ allTransactionsByMonth, sumAllAmountGained, sumAllAmountExpend });
  } catch (err) {
    console.error(err);
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const queryDeleteTransaction = `
    WITH del AS (
      DELETE FROM transactions 
      WHERE id = $1
      RETURNING *
    ),
    upd AS (
      UPDATE expense_limits el
      SET amount_spent = GREATEST(0, el.amount_spent - del.amount)
      FROM del
      WHERE del.type = 'expense'
        AND del.payment_condition = 'single'
        AND el.created_by = del.created_by
        AND el.coin_id = del.coin_id
        AND el.category_id = del.category_id
        AND el.created_at BETWEEN (DATE_TRUNC('month', del.date::date)) AND (DATE_TRUNC('month', del.date::date) + INTERVAL '1 month - 1 day')
    )
    SELECT * FROM del
    `;
    const valuesDeleteTransaction = [id];
    await db.query(queryDeleteTransaction, valuesDeleteTransaction);

    return res.status(200).json({ message: "Transação deletada" });
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ message: "Ocorreu um problema ao deletar sua transação" });
  }
};

export const getOneTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const queryGetOneTransaction = `SELECT t.*, ac.description as account, cat.description as category, sub.description as subcategory
    FROM transactions t
    JOIN coins c ON t.coin_id = c.id
    JOIN accounts ac ON t.account_id = ac.id
    JOIN categories cat ON t.category_id = cat.id
    JOIN subcategories sub ON t.subcategory_id = sub.id
    WHERE t.id = $1
    `;

    const valuesGetOneTransaction = [id];

    const {rows: oneTransaction} = await db.query(queryGetOneTransaction, valuesGetOneTransaction);

    res.status(200).json(oneTransaction[0]);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Can't find the transaction" });
  }
};

export const getAllInstallmentsTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const queryGroupInstallmentId = `SELECT group_installment_id FROM transactions WHERE id = $1`;
    const valuesGroupInstallmentId = [id];
    const {rows: groupInstallmentId} = await db.query(queryGroupInstallmentId, valuesGroupInstallmentId);

    if(groupInstallmentId === null || groupInstallmentId[0].group_installment_id === null) {
      throw new Error("Couldn't find group installment");
    }

    const groupId = groupInstallmentId[0].group_installment_id;

    const queryAllInstallmentsTransaction = `SELECT t.id, t.coin_id, t.type, t.description, t.amount, t.account_id, acc.description AS account, t.category_id,
    cat.description as category, t.subcategory_id, sub.description as subcategory, t.installments, t.payment_condition, t.install_number, t.date
    FROM transactions t
    JOIN transactions seed ON seed.id = $1
    JOIN accounts acc ON t.account_id = acc.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    LEFT JOIN subcategories sub ON t.subcategory_id = sub.id
    WHERE t.group_installment_id = seed.group_installment_id AND seed.group_installment_id IS NOT NULL
    ORDER BY t.date ASC
    `;

    const {rows: allInstallmentsTransaction} = await db.query(queryAllInstallmentsTransaction, [id]);

    if(allInstallmentsTransaction.length === 0) {
      throw new Error("Couldn't find installments transactions");
    }

    const dataAllInstallmentsSorted = {
      type: allInstallmentsTransaction[0].type,  
      description: allInstallmentsTransaction[0].description,
      amount: allInstallmentsTransaction.reduce((totalAmount, transaction) => totalAmount + transaction.amount, 0),
      account: allInstallmentsTransaction[0].account,
      account_id: allInstallmentsTransaction[0].account_id,
      category: allInstallmentsTransaction[0].category,
      category_id: allInstallmentsTransaction[0].category_id,
      subcategory: allInstallmentsTransaction[0].subcategory,
      subcategory_id: allInstallmentsTransaction[0].subcategory_id,
      date: allInstallmentsTransaction[0].date,
      installments: allInstallmentsTransaction[0].installments,  
      payment_condition: allInstallmentsTransaction[0].payment_condition,
      group_installment_id: groupId
    }

    res.status(200).json(dataAllInstallmentsSorted);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Can't find the transaction" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {
    type,
    amount,
    description,
    category_id,
    subcategory_id,
    account_id,
    date,
  } = req.body;
  const localDate = toPostgresDate(date.value);
  try {

    //bucket here refers to the month and category, if it changes I have to update the old bucket
      const queryUpdateTransaction = `
      WITH old AS (
        SELECT * 
        FROM transactions 
        WHERE id = $1
      ),
      upd AS (
        UPDATE transactions t
        SET type = $2, amount = $3, description = $4, account_id = $5, category_id = $6, subcategory_id = $7, date = $8
        FROM old
        WHERE t.id = old.id
        RETURNING t.*
      ),
      same_bucket AS (
        UPDATE expense_limits el
        SET amount_spent = GREATEST(0, amount_spent - (old.amount - upd.amount))
        FROM old, upd
        WHERE old.type = 'expense'
          AND el.created_by = upd.created_by
          AND el.coin_id = upd.coin_id
          AND el.category_id = upd.category_id
          AND el.created_at BETWEEN (DATE_TRUNC('month', old.date::date)) AND (DATE_TRUNC('month', old.date::date) + INTERVAL '1 month - 1 day')
        RETURNING el.id
      ),
      diff_bucket_old AS (
        UPDATE expense_limits el
        SET amount_spent = GREATEST(0, amount_spent - old.amount)
        FROM old, upd
        WHERE old.type = 'expense'
          AND (old.category_id <> upd.category_id OR DATE_TRUNC('month', old.date::date) <> DATE_TRUNC('month', upd.date::date))
          AND el.created_by = old.created_by
          AND el.coin_id = old.coin_id
          AND el.category_id = old.category_id
          AND el.created_at BETWEEN (DATE_TRUNC('month', old.date::date)) AND (DATE_TRUNC('month', old.date::date) + INTERVAL '1 month - 1 day')
        RETURNING el.id
      ),
      diff_bucket_new AS (
        UPDATE expense_limits el
        SET amount_spent = el.amount_spent + upd.amount
        FROM old, upd
        WHERE upd.type = 'expense'
          AND (old.category_id <> upd.category_id OR DATE_TRUNC('month', old.date::date) <> DATE_TRUNC('month', upd.date::date))
          AND el.created_by = upd.created_by
          AND el.coin_id = upd.coin_id
          AND el.category_id = upd.category_id
          AND el.created_at BETWEEN (DATE_TRUNC('month', upd.date::date)) AND (DATE_TRUNC('month', upd.date::date) + INTERVAL '1 month - 1 day')
        RETURNING el.id
      )
      SELECT * FROM upd
      `;

      const queryValues = [id, type, amount, description, account_id, category_id, subcategory_id || null, localDate];
      
      const {rows: responseUpdateTransaction} = await db.query(queryUpdateTransaction, queryValues);
      
      return res.status(200).json(responseUpdateTransaction);
  } catch (err) {
    console.error(err);
    return res.status(422).json({ message: err });
  }
};

export const updateAllInstallmentsTransaction = async (req: Request, res: Response) => {
  const {
    amount,
    description,
    category_id,
    subcategory_id,
    account_id,
    date,
  } = req.body;
  const newInstallments = parseInt(req.body.installments);

  const {id} = req.params;
  const localDate = toPostgresDate(date.value);

  try{
    const queryUpdateAllInstallments = `
    WITH seed AS (
     SELECT 
        t.group_installment_id AS gid,
        t.created_by,
        t.coin_id
    FROM transactions t
    WHERE t.id = $1 AND t.group_installment_id IS NOT NULL
    ),
    -- delete installments if the number shrank
    del AS (
      DELETE FROM transactions x
      USING seed
      WHERE x.group_installment_id = seed.gid
        AND x.install_number > $2
      RETURNING x.*
    ),
    -- builds a temporary table with the number of installments to be created/updated
    gen AS (
      SELECT generate_series(1, $2)::int AS n
    ),
    -- build the values to be inserted
    values AS (
      SELECT seed.coin_id AS coin_id,
      'expense'::text AS type,
      $4::text AS description,
      ($3::bigint / $2) + CASE WHEN n = 1 THEN ($3::bigint % $2) ELSE 0 END as amount,
      $5::uuid as account_id,
      $6::uuid as category_id,
      $7::uuid as subcategory_id,
      ($8::date + (n-1) * (INTERVAL '1 month'))::date AS date,
      'multi'::text AS payment_condition,
      n AS install_number,
      $2::int AS installments,
      seed.gid AS group_installment_id,
      seed.created_by AS created_by
      FROM gen, seed
    ),
    --  do a upsert in the above create values of the new installments
    upsert AS (
      INSERT INTO transactions (coin_id, type, description, amount, account_id, category_id, subcategory_id, 
      date, payment_condition, install_number, installments, group_installment_id, created_by)
      SELECT * FROM values
      ON CONFLICT (group_installment_id, install_number)
      DO UPDATE SET
        description = EXCLUDED.description,
        amount = EXCLUDED.amount,
        category_id = EXCLUDED.category_id,
        subcategory_id = EXCLUDED.subcategory_id,
        account_id = EXCLUDED.account_id,
        date = EXCLUDED.date,
        installments = EXCLUDED.installments
      RETURNING *
    ),
    --  months touched by upsert and deletions
    bucket AS (
      SELECT u.created_by, u.coin_id, u.category_id, DATE_TRUNC('month', u.date::date) AS month_start
      FROM upsert u
      GROUP BY 1,2,3,4
      UNION
      SELECT d.created_by, d.coin_id, d.category_id, DATE_TRUNC('month', d.date::date) AS month_start
      FROM del d
    ),
    -- recompute correct monthly totals for transactions
    agg AS (
      SELECT b.created_by, b.coin_id, b.category_id, b.month_start,

      -- 
      COALESCE((
        SELECT SUM(t.amount)
        FROM transactions t
        WHERE t.created_by = b.created_by
          AND t.coin_id = b.coin_id
          AND t.category_id = b.category_id
          AND t.type = 'expense'
          AND t.date >= b.month_start 
          AND t.date < (b.month_start + INTERVAL '1 month')::date
          AND (t.group_installment_id IS DISTINCT FROM s.gid OR t.group_installment_id IS NULL)
      ),0)

      +

      COALESCE((
        SELECT SUM(u.amount)
        FROM upsert u
        WHERE u.created_by = b.created_by
          AND u.coin_id = b.coin_id
          AND u.category_id = b.category_id
          AND u.date >= b.month_start 
          AND u.date < (b.month_start + INTERVAL '1 month')::date
      ),0) AS total_amount
      FROM bucket b, seed s
    ),
    upd_expense_limits AS (
      UPDATE expense_limits el
      SET amount_spent = agg.total_amount
      FROM agg
      WHERE el.created_by = agg.created_by
        AND el.coin_id = agg.coin_id
        AND el.category_id = agg.category_id
        AND el.created_at >= agg.month_start 
        AND el.created_at < (agg.month_start + INTERVAL '1 month')::date
      RETURNING el.id
    )
    SELECT * FROM upsert
    `;

    const valuesUpdateallInstallments = [id, newInstallments, amount, description, account_id, category_id, subcategory_id || null, localDate];

    const {rows: updateTransactions } = await db.query(queryUpdateAllInstallments, valuesUpdateallInstallments);

    return res.status(200).json({updateTransactions});
  }catch(err) {
    console.error(err);
    return res.status(422).json({ message: "Couldn't update transaction" });
  }
};

export const deleteOneInstallmentTransaction = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const queryCurrentTransaction = `SELECT group_installment_id, installments FROM transactions WHERE id = $1`;
    const valuesCurrentTransaction = [id];

    const {rows: currentTransaction} = await db.query(queryCurrentTransaction, valuesCurrentTransaction);

    if (
      currentTransaction === null ||
      currentTransaction[0].group_installment_id === null
    ) {
      throw new Error("Couldn't find group installment");
    }

    const queryDeleteOneInstallment = `DELETE FROM transactions WHERE id = $1`;
    const valuesDeleteOneInstallment = [id];

    await db.query(queryDeleteOneInstallment, valuesDeleteOneInstallment);

    const queryRemainingInstallments = `SELECT id FROM transactions WHERE group_installment_id = $1 ORDER BY install_number ASC`;
    const valuesRemaningInstallments = [currentTransaction[0].group_installment_id];

    const {rows: remainingInstallments} = await db.query(queryRemainingInstallments, valuesRemaningInstallments);

    const lengthRemainingInstallments = remainingInstallments.length;

    for (let i = 0; i < lengthRemainingInstallments; i++) {
      const updateInstallment = remainingInstallments[i];

      const queryUpdateInstallment = `UPDATE transactions 
      SET install_number = $1, installments = $2
      WHERE id = $3`;
      const valuesUpdateInstallments = [i+1, lengthRemainingInstallments, updateInstallment.id];

      await db.query(queryUpdateInstallment, valuesUpdateInstallments);
    }

    return res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    return res
      .status(422)
      .json({ message: "Error trying to delete transaction" });
  }
};

export const deleteAllInstallmentsTransaction = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const queryDeleteAllInstallments = `DELETE 
    FROM transactions 
    WHERE group_installment_id = (SELECT group_installment_id FROM transactions WHERE id = $1)`;

    const valuesDeleteAllInstallments = [id];

    await db.query(queryDeleteAllInstallments, valuesDeleteAllInstallments);

    return res.status(200).json({ message: "All transaction installments deleted" });
  } catch (err) {
    console.error(err);
    return res.status(422).json({ message: "Error trying to delete transaction" });
  }
};
