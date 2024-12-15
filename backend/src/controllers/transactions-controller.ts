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
            type: type,
            desc: desc,
            amount: amountSplit[i],
            category: category.id,
            subCategory: subCategory.id,
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

        const bulkTransactionsObj = {
          bulkTransactions,
        };

        queryExpenseTransaction = e.params(
          {
            bulkTransactions: e.array(
              e.tuple({
                type: e.str,
                desc: e.str,
                amount: e.int32,
                category: e.uuid,
                subCategory: e.uuid,
                account: e.uuid,
                recurrency: e.str,
                date: e.cal.local_date,
                created_by: e.uuid,
                payment_condition: e.str,
                installments: e.int16,
                install_number: e.int16,
                group_installment_id: e.uuid,
              })
            ),
          },
          (params) => {
            return e.for(e.array_unpack(params.bulkTransactions), (item) => {
              return e.insert(e.Transaction, {
                type: item.type,
                desc: item.desc,
                amount: item.amount,
                category: e.cast(e.Category, item.category),
                subCategory: e.cast(e.subCategory, item.subCategory),
                account: e.cast(e.Account, item.account),
                recurrency: e.cast(e.Recurrency, item.recurrency),
                date: item.date,
                created_by: e.cast(e.User, item.created_by),
                payment_condition: item.payment_condition,
                install_number: item.install_number,
                installments: installments,
                group_installment_id: item.group_installment_id,
              });
            });
          }
        );

        expenseTransaction = await queryExpenseTransaction.run(
          clientDB,
          bulkTransactionsObj
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
  const startDate = toLocalDate(selectedDate);
  const date = new Date(selectedDate);
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
          filter: e.op(filterByUser, "and", filterByDate),
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
    throw new Error(err as string);
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
    paymentCondition,
    installments,
  } = req.body;
  const hasSubCategory = subCategory
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
      if (paymentCondition === "single") {
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
            payment_condition: e.str(paymentCondition),
          },
        }));
      }
    }

    await queryUpdateTransaction!.run(clientDB);

    return res
      .status(200)
      .json({ message: "Transaction updated", date: date.value });
  } catch (err) {
    console.error(err);
    return res.status(422).json({ message: "Can't update transaction" });
  }
};

export const deleteOneTransactionInstallment = async (
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
    console.log(remainingInstallments);

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

export const deleteAllTransactionInstallment = async (
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
