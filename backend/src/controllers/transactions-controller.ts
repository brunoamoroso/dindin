import { Request, Response } from "express";
import { db } from "../db/conn";
import { toPostgresDate } from "../utils/to-postgres-date";
import splitInstallments from "../utils/split-installments";

export const addTransaction = async (req: Request, res: Response) => {
  const {
    type,
    amount,
    desc,
    category,
    subCategory,
    account,
    date,
    paymentCondition,
  } = req.body;
  let localDate = toPostgresDate(date.value);
  const installments = parseInt(req.body.installments);

  try {
    if (type === "gain") {
      const queryGainTransaction = `INSERT INTO transactions (coin_id, type, description, amount, account_id, category_id, subcategory_id, date, created_by)
      VALUES ((SELECT user_default_coin FROM users WHERE id = $1),
      $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
      const valuesGainTransaction = [req.user, type, desc, amount, account.id, category.id, subCategory?.id, localDate, req.user];

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
      queryExpenseTransaction = `INSERT INTO transactions (coin_id, type, description, amount, account_id, category_id, subcategory_id, date, payment_condition, created_by)
      VALUES ((SELECT user_default_coin FROM users WHERE id = $1),$2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

      expenseValues = [req.user, type, desc, amount, account.id, category.id, subCategory?.id, localDate, paymentCondition, req.user];

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

        return [req.user, type, desc, amountSplit[i], account.id, category.id, subCategory?.id, localDate, paymentCondition, i + 1, installments, groupInstallmentId, req.user];
      });

      queryExpenseTransaction = `INSERT INTO transactions (coin_id, type, description, amount, account_id,
      category_id, subcategory_id, date, payment_condition, install_number, installments, group_installment_id, created_by)
      VALUES `;

      const valuesPlaceholder = Array.from({length: bulkTransactions.length}, (_, i) => {
        return `((SELECT user_default_coin FROM users WHERE id = $${i * 13 + 1}), $${i * 13 + 2}, $${i * 13 + 3}, $${i * 13 + 4}, $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, $${i * 13 + 9}, $${i * 13 + 10}, $${i * 13 + 11}, $${i * 13 + 12}, $${i * 13 + 13})`;
      }).join(", ");

      queryExpenseTransaction += valuesPlaceholder + " RETURNING *";

      const {rows: expenseTransaction} = await db.query(queryExpenseTransaction, bulkTransactions.flat());
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
  const { selectedDate } = req.params;
  const date = new Date(selectedDate);
  const createStartDate = toPostgresDate(new Date(date.getFullYear(), date.getMonth(), 1).toISOString());
  const createEndDate = toPostgresDate(new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).toISOString());

  try {
    const queryAllTransactionsByMonth = `SELECT t.id, t.type, t.description, t.amount, t.account_id, acc.description AS account, t.category_id, t.subcategory_id,
    cat.description AS category, sub.description AS subcategory, t.installments, t.install_number, t.date
    FROM transactions t
    JOIN users u ON t.created_by = u.id
    JOIN coins c ON u.user_default_coin = c.id
    LEFT JOIN accounts acc ON t.account_id = acc.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    LEFT JOIN subcategories sub ON t.subcategory_id = sub.id
    WHERE t.created_by = $1 AND t.date BETWEEN $2 AND $3
    ORDER BY t.date DESC
    `;

    const valuesAllTransactionsByMonth = [req.user, createStartDate, createEndDate];

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
    const queryDeleteTransaction = `DELETE FROM transactions WHERE id = $1`;
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
    JOIN accounts acc ON t.account_id = acc.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    LEFT JOIN subcategories sub ON t.subcategory_id = sub.id
    WHERE t.group_installment_id = $1
    ORDER BY t.date ASC
    `;

    const valuesQueryAllInstallmentsTransaction = [groupId];
    const {rows: allInstallmentsTransaction} = await db.query(queryAllInstallmentsTransaction, valuesQueryAllInstallmentsTransaction);


    const dataAllInstallmentsSorted = {
      type: allInstallmentsTransaction[0].type,  
      description: allInstallmentsTransaction[0].description,
      amount: allInstallmentsTransaction.reduce((totalAmount, transaction) => totalAmount + transaction.amount, 0),
      account: allInstallmentsTransaction[0].account,
      category: allInstallmentsTransaction[0].category,
      subCategory: allInstallmentsTransaction[0].subcategory,
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

// export const updateTransaction = async (req: Request, res: Response) => {
//   const {
//     id,
//     type,
//     amount,
//     desc,
//     category,
//     subCategory,
//     account,
//     recurrency,
//     date,
//   } = req.body;
//   const hasSubCategory = subCategory?.id
//     ? e.cast(e.subCategory, e.uuid(subCategory.id))
//     : null;
//   const localDate = toLocalDate(date.value);

//   let queryUpdateTransaction;
//   try {
//     if (type === "gain") {
//       queryUpdateTransaction = e.update(e.Transaction, () => ({
//         filter_single: { id: id },
//         set: {
//           type: type,
//           amount: e.int32(amount),
//           desc: e.str(desc),
//           category: e.cast(e.Category, e.uuid(category.id)),
//           subCategory: hasSubCategory,
//           account: e.cast(e.Account, e.uuid(account.id)),
//           recurrency: e.cast(e.Recurrency, recurrency.id),
//           date: e.cal.local_date(localDate),
//           created_by: e.cast(e.User, e.uuid(req.user)),
//         },
//       }));
//     }

//     if (type === "expense") {
//       queryUpdateTransaction = e.update(e.Transaction, () => ({
//         filter_single: { id: id },
//         set: {
//           type: type,
//           amount: e.int32(amount),
//           desc: e.str(desc),
//           category: e.cast(e.Category, e.uuid(category.id)),
//           subCategory: hasSubCategory,
//           account: e.cast(e.Account, e.uuid(account.id)),
//           recurrency: e.cast(e.Recurrency, recurrency.id),
//           date: e.cal.local_date(localDate),
//           created_by: e.cast(e.User, e.uuid(req.user)),
//         },
//       }));
//     }

//     if(queryUpdateTransaction === undefined) {
//       throw new Error("queryUpdateTransaction is undefined");
//     }

//     await queryUpdateTransaction.run(clientDB);

//     return res
//       .status(200)
//       .json({ message: "Transaction updated", date: date.value });
//   } catch (err) {
//     return res.status(422).json({ message: err });
//   }
// };

// export const updateAllInstallmentsTransaction = async (req: Request, res: Response) => {
//   const {
//     amount,
//     desc,
//     category,
//     subCategory,
//     account,
//     recurrency,
//     date,
//   } = req.body;
//   const installments = parseInt(req.body.installments);

//   const {id} = req.params;
//   let localDate = toLocalDate(date.value);

//   try{
//     if(id === undefined) {
//       throw new Error("Id is undefined");
//     }

//     const amountSplit = splitInstallments({ amount, installments }); // in cents
    
//     //if installments lower than the current installments, update the installments and delete the remaining
//     const queryCurrentData = await e.select(e.Transaction, (t) => ({
//       group_installment_id: true,
//       installments: true,
//       filter_single: e.op(t.id, "=", e.uuid(id)),
//     })).run(clientDB);

//     if(queryCurrentData === null || queryCurrentData.installments === null) {
//       throw new Error("Current Installments returned as null");
//     }

//     if(queryCurrentData.group_installment_id === null) {
//       throw new Error("Group Installment Id returned as null");
//     }

//     //if installments higher than the current installments, update the installments and create the new installments (upsert)
//     const bulkTransactions = Array.from({ length: installments }, (_, i) => {
//       // create and array of objects of the transactions
//       if (i > 0) {
//         const dateIncrease = new Date(date.value);
//         if (dateIncrease.getDate() === 31) {
//           // +1 because 0 returns the last day from the previous month
//           dateIncrease.setFullYear(
//             dateIncrease.getFullYear(),
//             dateIncrease.getMonth() + (i + 1),
//             0
//           );
//         } else {
//           dateIncrease.setMonth(dateIncrease.getMonth() + i);
//         }
//         localDate = toLocalDate(dateIncrease.toISOString());
//       }

//       return {
//         coin: req.user,
//         type: "expense",
//         desc: desc,
//         amount: amountSplit[i],
//         category: category.id,
//         subCategory: subCategory && subCategory.id ? subCategory.id : null,
//         account: account.id,
//         recurrency: recurrency.id,
//         date: localDate,
//         created_by: req.user,
//         install_number: i + 1,
//         payment_condition: "multi",
//         installments: installments,
//         group_installment_id: queryCurrentData.group_installment_id!,
//       };
//     });

//     const queryUpdateAllInstallments = `
//       WITH bulk_transactions := <array<json>>$bulkTransactions,
//       FOR item IN array_unpack(bulk_transactions) UNION (
//         INSERT Transaction {
//           coin := (SELECT Coin FILTER .<user_default_coin[is User].id = <uuid>item['coin'] LIMIT 1),
//           type := <str>item['type'],
//           desc := <str>item['desc'],
//           amount := <int32>item['amount'],
//           category := (SELECT Category FILTER .id = <uuid>item['category']),
//           subCategory := (SELECT subCategory FILTER .id = <uuid>item['subCategory']),
//           account := (SELECT Account FILTER .id = <uuid>item['account']),
//           recurrency := <Recurrency>item['recurrency'],
//           date := <cal::local_date>item['date'],
//           created_by := (SELECT User FILTER .id = <uuid>item['created_by']),
//           install_number := <int16>item['install_number'],
//           installments := <int16>item['installments'],
//           payment_condition := <str>item['payment_condition'],
//           group_installment_id := <uuid>item['group_installment_id']
//         } 
//           UNLESS CONFLICT ON (.group_installment_id, .install_number) 
//           ELSE (
//             UPDATE Transaction
//             SET {
//               desc := <str>item['desc'],
//               amount := <int32>item['amount'],
//               category := (SELECT Category FILTER .id = <uuid>item['category']),
//               subCategory := (
//                 SELECT subCategory FILTER .id = <uuid>item['subCategory']
//               ),
//               account := (SELECT Account FILTER .id = <uuid>item['account']),
//               recurrency := <Recurrency>item['recurrency'],
//               date := <cal::local_date>item['date'],
//               installments := <int16>item['installments'],
//             }
//           )
//       )
//     `;

//     await clientDB.query(
//       queryUpdateAllInstallments,
//       { bulkTransactions }
//     );

//     //after updating time to delete the remaining installments
//     if(installments < queryCurrentData.installments) {
//       const queryDeleteRemainingInstallments = e.delete(e.Transaction, (t) => ({
//         filter: e.op(e.op(t.group_installment_id, "=", e.uuid(queryCurrentData.group_installment_id!)), "and", e.op(t.install_number, ">", installments)),
//       }));

//       await queryDeleteRemainingInstallments.run(clientDB);
//     }

//     return res.status(200).json({message: "Transaction updated"});
//   }catch(err) {
//     console.error(err);
//     return res.status(422).json({ message: "Couldn't update transaction" });
//   }
// };

// export const deleteOneInstallmentTransaction = async (
//   req: Request,
//   res: Response
// ) => {
//   const { id } = req.params;

//   try {
//     const currentTransaction = await e
//       .select(e.Transaction, (t) => ({
//         group_installment_id: true,
//         filter_single: e.op(t.id, "=", e.uuid(id)),
//       }))
//       .run(clientDB);

//     if (
//       currentTransaction === null ||
//       currentTransaction.group_installment_id === null
//     ) {
//       throw new Error("Couldn't find group installment");
//     }

//     const groupInstallments = await e
//       .select(e.Transaction, (t) => ({
//         id: true,
//         install_number: true,
//         installments: true,
//         filter: e.op(
//           t.group_installment_id,
//           "=",
//           e.uuid(currentTransaction.group_installment_id!)
//         ),
//       }))
//       .run(clientDB);

//     await e
//       .delete(e.Transaction, (t) => ({
//         filter_single: { id: id },
//       }))
//       .run(clientDB);

//     const remainingInstallments = groupInstallments.filter(
//       (install) => install.id !== id
//     );

//     for (let i = 0; i < remainingInstallments.length; i++) {
//       const updateInstallment = remainingInstallments[i];
//       await e
//         .update(e.Transaction, (t) => ({
//           filter_single: e.op(t.id, "=", e.uuid(updateInstallment.id)),
//           set: {
//             install_number: i + 1,
//             installments: remainingInstallments.length,
//           },
//         }))
//         .run(clientDB);
//     }

//     return res.status(200).json({ message: "Transaction deleted" });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(422)
//       .json({ message: "Error trying to delete transaction" });
//   }
// };

// export const deleteAllInstallmentsTransaction = async (
//   req: Request,
//   res: Response
// ) => {
//   const { id } = req.params;
//   try {
//     const groupInstallmentId = await e
//       .select(e.Transaction, (t) => ({
//         group_installment_id: true,
//         filter_single: e.op(t.id, "=", e.uuid(id)),
//       }))
//       .run(clientDB);

//     if (
//       groupInstallmentId === null ||
//       groupInstallmentId.group_installment_id === null
//     ) {
//       throw new Error("Couldn't find group installment");
//     }

//     await e
//       .delete(e.Transaction, (t) => ({
//         filter: e.op(
//           t.group_installment_id,
//           "=",
//           e.uuid(groupInstallmentId.group_installment_id!)
//         ),
//       }))
//       .run(clientDB);

//     return res
//       .status(200)
//       .json({ message: "All transaction installments deleted" });
//   } catch (err) {
//     console.error(err);
//   }
// };
