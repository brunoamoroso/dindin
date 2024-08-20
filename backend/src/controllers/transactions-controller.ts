import { Request, Response } from "express";
import clientDB from "../db/conn";
import { LocalDate } from "edgedb";
import e from '../db/dbschema/edgeql-js';
import toLocalDate from "../utils/to-local-date";

export const addTransaction = async (req: Request, res: Response) => {
    const {type, amount, desc, category, subCategory, account, recurrency, date, paymentMethod, paymentCondition} = req.body;
    const localDate = toLocalDate(date.value);
    let installments = parseInt(req.body.installments);
    const hasSubCategory = subCategory ? e.cast(e.subCategory, e.uuid(subCategory.id)) : null;

    try{
        if(type === "gain"){
            const queryGainTransaction = e.insert(e.Gain, {
                description: e.str(desc),
                amount: e.int32(amount),
                category: e.cast(e.Category, e.uuid(category.id)),
                subCategory: hasSubCategory,
                account: e.cast(e.Account, e.uuid(account.id)),
                recurrency: e.cast(e.Recurrency, recurrency.id),
                date_earned: e.cal.local_date(localDate),
                created_by: e.cast(e.User, e.uuid(req.user))
            });

            const gainTransaction = await queryGainTransaction.run(clientDB);
            res.status(201).json(gainTransaction);
            return;
        }

        if(type === "expense"){
            if(paymentMethod === undefined){
                return res.status(422).json({message: "Payment Method is mandatory"});
            }

            if(paymentCondition === undefined){
                return res.status(422).json({message: "Payment Condition is mandatory"});
            }

            if(paymentMethod === "credit" && paymentCondition === "single"){
                installments = 1;
            }

            const queryExpenseTransaction = e.insert(e.Expense, {
                description: e.str(desc),
                amount: e.int32(amount),
                category: e.cast(e.Category, e.uuid(category.id)),
                subCategory: e.cast(e.subCategory, e.uuid(subCategory.id)),
                account: e.cast(e.Account, e.uuid(account.id)),
                recurrency: e.cast(e.Recurrency, recurrency.id),
                date_paid: e.cal.local_date(localDate),
                created_by: e.cast(e.User, e.uuid(req.user)),
                payment_condition: e.str(paymentCondition),
                payment_method: e.str(paymentMethod),
                installments: e.int16(installments)
            });

            const expenseTransaction = await queryExpenseTransaction.run(clientDB);
            return res.status(201).json(expenseTransaction);
        }
    }catch(err){
        res.status(422).json({message: "Couldn't create the transaction"})
        throw new Error(err as string);
    }
}

export const getAllTransactionsByMonth = async (req: Request, res: Response) => {
    const {selectedDate} = req.params;
    const startDate = toLocalDate(selectedDate);
    const date = new Date(selectedDate); 
    const createEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
    const endDate = toLocalDate(createEndDate);

    try{    
        const queryAllTransactionGainsByMonth = e.select(e.Gain, (gain) => {

            const filterByUser = e.op(gain.created_by.id, "=", e.uuid(req.user));
            const filterByDate = e.op(
                e.op(gain.date_earned, ">=", e.cal.local_date(startDate)),
                "and",
                e.op(gain.date_earned, "<=", e.cal.local_date(endDate))
            )

            return{
                description: true,
                amount: true,
                account: {
                    description: true
                },
                category: {
                    desc: true,
                },
                subCategory: {
                    desc: true,
                },
                date_earned: true,
                filter: e.op(filterByUser, "and", filterByDate)
            }
        });

        const allTransactionGainsByMonth = await queryAllTransactionGainsByMonth.run(clientDB);

        const sumAllAmountGained = allTransactionGainsByMonth.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);

        const queryAllTransactionExpenseByMonth = e.select(e.Expense, (expense) => {
            const filterByUser = e.op(expense.created_by.id, "=", e.uuid(req.user));
            const filterByDate = e.op(
                e.op(expense.date_paid, ">=", e.cal.local_date(startDate)),
                "and",
                e.op(expense.date_paid, "<=", e.cal.local_date(endDate))
            )

            return {
                description: true,
                amount: true,
                account: {
                    description: true
                },
                category: {
                    desc: true
                },
                subCategory: {
                    desc: true
                },
                date_paid: true,
                filter: e.op(filterByUser,  "and", filterByDate)
            }
        });

        const allTransactionExpenseByMonth = await queryAllTransactionExpenseByMonth.run(clientDB);

        const sumAllAmountExpend = allTransactionExpenseByMonth.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);

        return res.status(200).json({allTransactionGainsByMonth, sumAllAmountGained, allTransactionExpenseByMonth, sumAllAmountExpend});

    }catch(err){
        throw new Error(err as string);
    }
}