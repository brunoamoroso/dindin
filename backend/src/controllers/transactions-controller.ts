import { Request, Response } from "express";
import clientDB from "../db/conn";
import e from "../db/dbschema/edgeql-js";
import toLocalDate from "../utils/to-local-date";
import splitInstallments from "../utils/split-installments";

export const addTransaction = async (req: Request, res: Response) => {
  const {
    type,
    amount,
    desc,
    category,
    subCategory,
    account,
    recurrency,
    date,
    paymentCondition,
  } = req.body;
  let localDate = toLocalDate(date.value);
  const installments = parseInt(req.body.installments);
  const hasSubCategory =
    subCategory && subCategory.id
      ? e.cast(e.subCategory, e.uuid(subCategory.id))
      : null;

  try {
    if (type === "gain") {
      const queryGainTransaction = e.insert(e.Transaction, {
        coin: e.select(e.Coin, (c) => ({
          filter_single: e.op(c["<user_default_coin[is User]"].id, "=", e.uuid(req.user)),
        })),
        type: type,
        desc: e.str(desc),
        amount: e.int32(amount),
        category: e.cast(e.Category, e.uuid(category.id)),
        subCategory: hasSubCategory,
        account: e.cast(e.Account, e.uuid(account.id)),
        recurrency: e.cast(e.Recurrency, recurrency.id),
        date: e.cal.local_date(localDate),
        created_by: e.cast(e.User, e.uuid(req.user)),
      });

      const gainTransaction = await queryGainTransaction.run(clientDB);
      res.status(201).json(gainTransaction);
      return;
    }

    if (type === "expense") {
      let queryExpenseTransaction;
      let bulkTransactions;
      let expenseTransaction;

      if (paymentCondition === undefined) {
        return res
          .status(422)
          .json({ message: "Payment Condition is mandatory" });
      }

      if (paymentCondition === "single") {
        queryExpenseTransaction = e.insert(e.Transaction, {
          coin: e.select(e.Coin, (c) => ({
            filter_single: e.op(c["<user_default_coin[is User]"].id, "=", e.uuid(req.user)),
          })),
          type: type,
          desc: e.str(desc),
          amount: e.int32(amount),
          category: e.cast(e.Category, e.uuid(category.id)),
          subCategory: hasSubCategory,
          account: e.cast(e.Account, e.uuid(account.id)),
          recurrency: e.cast(e.Recurrency, recurrency.id),
          date: e.cal.local_date(localDate),
          created_by: e.cast(e.User, e.uuid(req.user)),
          payment_condition: e.str(paymentCondition),
        });

        expenseTransaction = await queryExpenseTransaction.run(clientDB);
      }

      if (paymentCondition === "multi") {
        const amountSplit = splitInstallments({ amount, installments }); // in cents
        const queryUUID = e.uuid_generate_v4();
        const groupInstallmentId = await queryUUID.run(clientDB);

        bulkTransactions = Array.from({ length: installments }, (_, i) => {
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
            localDate = toLocalDate(dateIncrease.toISOString());
          }

          return {
            coin: req.user,
            type: type,
            desc: desc,
            amount: amountSplit[i],
            category: category.id,
            subCategory: subCategory && subCategory.id ? subCategory.id : null,
            account: account.id,
            recurrency: recurrency.id,
            date: localDate,
            created_by: req.user,
            install_number: i + 1,
            installments: installments,
            payment_condition: paymentCondition,
            group_installment_id: groupInstallmentId,
          };
        });

        queryExpenseTransaction = `WITH bulk_transactions := <array<json>>$bulkTransactions,
          FOR item IN array_unpack(bulk_transactions) UNION (
          INSERT Transaction {
            coin := (SELECT Coin FILTER .<[user_default_coin[is User].id = <uuid>item['coin']),
            type := <str>item['type'],
            desc := <str>item['desc'],
            amount := <int32>item['amount'],
            category := (SELECT Category FILTER .id = <uuid>item['category']),
            subCategory := (SELECT subCategory FILTER .id = <uuid>item['subCategory']),
            account := (SELECT Account FILTER .id = <uuid>item['account']),
            recurrency := <Recurrency>item['recurrency'],
            date := <cal::local_date>item['date'],
            created_by := (SELECT User FILTER .id = <uuid>item['created_by']),
            install_number := <int16>item['install_number'],
            installments := <int16>item['installments'],
            payment_condition := <str>item['payment_condition'],
            group_installment_id := <uuid>item['group_installment_id']
        })`;

        expenseTransaction = await clientDB.query(
          queryExpenseTransaction,
          {bulkTransactions}
        );
      }

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
  const createStartDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
  const startDate = toLocalDate(createStartDate);
  const createEndDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).toISOString();
  const endDate = toLocalDate(createEndDate);

  try {
    const queryAllTransactionsByMonth = e.select(
      e.Transaction,
      (transaction) => {
        const filterByUser = e.op(
          transaction.created_by.id,
          "=",
          e.uuid(req.user)
        );
        const filterByDate = e.op(
          e.op(transaction.date, ">=", e.cal.local_date(startDate)),
          "and",
          e.op(transaction.date, "<=", e.cal.local_date(endDate))
        );
        const filterByDefaultCoin = e.op(
          transaction.coin,
          "=",
          e.select(e.Coin, (c) => ({
            filter_single: e.op(c["<user_default_coin[is User]"].id, "=", e.uuid(req.user)),
          }))
        );

        return {
          id: true,
          type: true,
          desc: true,
          amount: true,
          account: {
            desc: true,
          },
          category: {
            desc: true,
          },
          subCategory: {
            desc: true,
          },
          installments: true,
          install_number: true,
          date: true,
          filter: e.op(e.op(filterByUser, "and", filterByDefaultCoin), "and", filterByDate),
          order_by: {
            expression: transaction.date,
            direction: e.DESC,
          },
        };
      }
    );

    const allTransactionsByMonth = await queryAllTransactionsByMonth.run(
      clientDB
    );

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
    await e
      .delete(e.Transaction, (t) => ({
        filter_single: { id: id },
      }))
      .run(clientDB);

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
    const queryGetOneTransaction = await e
      .select(e.Transaction, () => {
        return {
          id: true,
          type: true,
          desc: true,
          amount: true,
          account: {
            id: true,
            desc: true,
          },
          category: {
            id: true,
            desc: true,
          },
          subCategory: {
            id: true,
            desc: true,
          },
          recurrency: true,
          date: true,
          installments: true,
          payment_condition: true,
          filter_single: { id: id },
        };
      })
      .run(clientDB);

    res.status(200).json(queryGetOneTransaction);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Can't find the transaction" });
  }
};

export const getAllInstallmentsTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const groupInstallmentId = await e.select(e.Transaction, (t) => ({
      group_installment_id: true,
      filter_single: e.op(t.id, "=", e.uuid(id)),
    })).run(clientDB);

    if(groupInstallmentId === null || groupInstallmentId.group_installment_id === null) {
      throw new Error("Couldn't find group installment");
    }

    const groupId = groupInstallmentId.group_installment_id;

    const queryAllInstallmentsTransaction = await e
      .select(e.Transaction, (t) => {
        return {
          type: true,
          desc: true,
          amount: true,
          account: {
            id: true,
            desc: true,
          },
          category: {
            id: true,
            desc: true,
          },
          subCategory: {
            id: true,
            desc: true,
          },
          recurrency: true,
          date: true,
          installments: true,
          install_number: true,
          payment_condition: true,
          group_installment_id: true,
          filter: e.op(t.group_installment_id, "=", e.uuid(groupId)),
          order_by: t.date,
        };
      })
      .run(clientDB);
      

    const dataAllInstallmentsSorted = {
      type: queryAllInstallmentsTransaction[0].type,  
      desc: queryAllInstallmentsTransaction[0].desc,
      amount: queryAllInstallmentsTransaction.reduce((totalAmount, transaction) => totalAmount + transaction.amount, 0),
      account: queryAllInstallmentsTransaction[0].account,
      category: queryAllInstallmentsTransaction[0].category,
      subCategory: queryAllInstallmentsTransaction[0].subCategory,
      recurrency: queryAllInstallmentsTransaction[0].recurrency,
      date: queryAllInstallmentsTransaction[0].date.toString(),
      installments: queryAllInstallmentsTransaction[0].installments,  
      payment_condition: queryAllInstallmentsTransaction[0].payment_condition,
      group_installment_id: queryAllInstallmentsTransaction[0].group_installment_id,
    }

    res.status(200).json(dataAllInstallmentsSorted);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Can't find the transaction" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  const {
    id,
    type,
    amount,
    desc,
    category,
    subCategory,
    account,
    recurrency,
    date,
  } = req.body;
  const hasSubCategory = subCategory?.id
    ? e.cast(e.subCategory, e.uuid(subCategory.id))
    : null;
  const localDate = toLocalDate(date.value);

  let queryUpdateTransaction;
  try {
    if (type === "gain") {
      queryUpdateTransaction = e.update(e.Transaction, () => ({
        filter_single: { id: id },
        set: {
          type: type,
          amount: e.int32(amount),
          desc: e.str(desc),
          category: e.cast(e.Category, e.uuid(category.id)),
          subCategory: hasSubCategory,
          account: e.cast(e.Account, e.uuid(account.id)),
          recurrency: e.cast(e.Recurrency, recurrency.id),
          date: e.cal.local_date(localDate),
          created_by: e.cast(e.User, e.uuid(req.user)),
        },
      }));
    }

    if (type === "expense") {
      queryUpdateTransaction = e.update(e.Transaction, () => ({
        filter_single: { id: id },
        set: {
          type: type,
          amount: e.int32(amount),
          desc: e.str(desc),
          category: e.cast(e.Category, e.uuid(category.id)),
          subCategory: hasSubCategory,
          account: e.cast(e.Account, e.uuid(account.id)),
          recurrency: e.cast(e.Recurrency, recurrency.id),
          date: e.cal.local_date(localDate),
          created_by: e.cast(e.User, e.uuid(req.user)),
        },
      }));
    }

    if(queryUpdateTransaction === undefined) {
      throw new Error("queryUpdateTransaction is undefined");
    }

    await queryUpdateTransaction.run(clientDB);

    return res
      .status(200)
      .json({ message: "Transaction updated", date: date.value });
  } catch (err) {
    return res.status(422).json({ message: err });
  }
};

export const updateAllInstallmentsTransaction = async (req: Request, res: Response) => {
  const {
    amount,
    desc,
    category,
    subCategory,
    account,
    recurrency,
    date,
  } = req.body;
  const installments = parseInt(req.body.installments);

  const {id} = req.params;
  let localDate = toLocalDate(date.value);

  try{
    if(id === undefined) {
      throw new Error("Id is undefined");
    }

    const amountSplit = splitInstallments({ amount, installments }); // in cents
    
    //if installments lower than the current installments, update the installments and delete the remaining
    const queryCurrentData = await e.select(e.Transaction, (t) => ({
      group_installment_id: true,
      installments: true,
      filter_single: e.op(t.id, "=", e.uuid(id)),
    })).run(clientDB);

    if(queryCurrentData === null || queryCurrentData.installments === null) {
      throw new Error("Current Installments returned as null");
    }

    if(queryCurrentData.group_installment_id === null) {
      throw new Error("Group Installment Id returned as null");
    }

    //if installments higher than the current installments, update the installments and create the new installments (upsert)
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
        localDate = toLocalDate(dateIncrease.toISOString());
      }

      return {
        type: "expense",
        desc: desc,
        amount: amountSplit[i],
        category: category.id,
        subCategory: subCategory && subCategory.id ? subCategory.id : null,
        account: account.id,
        recurrency: recurrency.id,
        date: localDate,
        created_by: req.user,
        install_number: i + 1,
        payment_condition: "multi",
        installments: installments,
        group_installment_id: queryCurrentData.group_installment_id!,
      };
    });

    const queryUpdateAllInstallments = `
      WITH bulk_transactions := <array<json>>$bulkTransactions,
      FOR item IN array_unpack(bulk_transactions) UNION (
        INSERT Transaction {
          type := <str>item['type'],
          desc := <str>item['desc'],
          amount := <int32>item['amount'],
          category := (SELECT Category FILTER .id = <uuid>item['category']),
          subCategory := (SELECT subCategory FILTER .id = <uuid>item['subCategory']),
          account := (SELECT Account FILTER .id = <uuid>item['account']),
          recurrency := <Recurrency>item['recurrency'],
          date := <cal::local_date>item['date'],
          created_by := (SELECT User FILTER .id = <uuid>item['created_by']),
          install_number := <int16>item['install_number'],
          installments := <int16>item['installments'],
          payment_condition := <str>item['payment_condition'],
          group_installment_id := <uuid>item['group_installment_id']
        } 
          UNLESS CONFLICT ON (.group_installment_id, .install_number) 
          ELSE (
            UPDATE Transaction
            SET {
              desc := <str>item['desc'],
              amount := <int32>item['amount'],
              category := (SELECT Category FILTER .id = <uuid>item['category']),
              subCategory := (
                SELECT subCategory FILTER .id = <uuid>item['subCategory']
              ),
              account := (SELECT Account FILTER .id = <uuid>item['account']),
              recurrency := <Recurrency>item['recurrency'],
              date := <cal::local_date>item['date'],
              installments := <int16>item['installments'],
            }
          )
      )
    `;

    await clientDB.query(
      queryUpdateAllInstallments,
      { bulkTransactions }
    );

    //after updating time to delete the remaining installments
    if(installments < queryCurrentData.installments) {
      const queryDeleteRemainingInstallments = e.delete(e.Transaction, (t) => ({
        filter: e.op(e.op(t.group_installment_id, "=", e.uuid(queryCurrentData.group_installment_id!)), "and", e.op(t.install_number, ">", installments)),
      }));

      await queryDeleteRemainingInstallments.run(clientDB);
    }

    return res.status(200).json({message: "Transaction updated"});
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
    const currentTransaction = await e
      .select(e.Transaction, (t) => ({
        group_installment_id: true,
        filter_single: e.op(t.id, "=", e.uuid(id)),
      }))
      .run(clientDB);

    if (
      currentTransaction === null ||
      currentTransaction.group_installment_id === null
    ) {
      throw new Error("Couldn't find group installment");
    }

    const groupInstallments = await e
      .select(e.Transaction, (t) => ({
        id: true,
        install_number: true,
        installments: true,
        filter: e.op(
          t.group_installment_id,
          "=",
          e.uuid(currentTransaction.group_installment_id!)
        ),
      }))
      .run(clientDB);

    await e
      .delete(e.Transaction, (t) => ({
        filter_single: { id: id },
      }))
      .run(clientDB);

    const remainingInstallments = groupInstallments.filter(
      (install) => install.id !== id
    );

    for (let i = 0; i < remainingInstallments.length; i++) {
      const updateInstallment = remainingInstallments[i];
      await e
        .update(e.Transaction, (t) => ({
          filter_single: e.op(t.id, "=", e.uuid(updateInstallment.id)),
          set: {
            install_number: i + 1,
            installments: remainingInstallments.length,
          },
        }))
        .run(clientDB);
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
    const groupInstallmentId = await e
      .select(e.Transaction, (t) => ({
        group_installment_id: true,
        filter_single: e.op(t.id, "=", e.uuid(id)),
      }))
      .run(clientDB);

    if (
      groupInstallmentId === null ||
      groupInstallmentId.group_installment_id === null
    ) {
      throw new Error("Couldn't find group installment");
    }

    await e
      .delete(e.Transaction, (t) => ({
        filter: e.op(
          t.group_installment_id,
          "=",
          e.uuid(groupInstallmentId.group_installment_id!)
        ),
      }))
      .run(clientDB);

    return res
      .status(200)
      .json({ message: "All transaction installments deleted" });
  } catch (err) {
    console.error(err);
  }
};
