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
            const queryGainTransaction = e.insert(e.Transaction, {
                type: type,
                desc: e.str(desc),
                amount: e.int32(amount),
                category: e.cast(e.Category, e.uuid(category.id)),
                subCategory: hasSubCategory,
                account: e.cast(e.Account, e.uuid(account.id)),
                recurrency: e.cast(e.Recurrency, recurrency.id),
                date: e.cal.local_date(localDate),
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

            const queryExpenseTransaction = e.insert(e.Transaction, {
                type: type,
                desc: e.str(desc),
                amount: e.int32(amount),
                category: e.cast(e.Category, e.uuid(category.id)),
                subCategory: e.cast(e.subCategory, e.uuid(subCategory.id)),
                account: e.cast(e.Account, e.uuid(account.id)),
                recurrency: e.cast(e.Recurrency, recurrency.id),
                date: e.cal.local_date(localDate),
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
        const queryAllTransactionsByMonth = e.select(e.Transaction, (transaction) => {

            const filterByUser = e.op(transaction.created_by.id, "=", e.uuid(req.user));
            const filterByDate = e.op(
                e.op(transaction.date, ">=", e.cal.local_date(startDate)),
                "and",
                e.op(transaction.date, "<=", e.cal.local_date(endDate))
            )

            return{
                type: true,
                desc: true,
                amount: true,
                account: {
                    desc: true
                },
                category: {
                    desc: true,
                },
                subCategory: {
                    desc: true,
                },
                date: true,
                filter: e.op(filterByUser, "and", filterByDate),
                order_by: {
                    expression: transaction.date,
                    direction: e.DESC
                }
            }
        });

        const allTransactionsByMonth = await queryAllTransactionsByMonth.run(clientDB);

        const sumAllAmountGained = allTransactionsByMonth.reduce((accumulator, currentValue) => {
            if(currentValue.type === "gain"){
                return accumulator + currentValue.amount
            }
            return accumulator;
        }, 0);

        const sumAllAmountExpend = allTransactionsByMonth.reduce((accumulator, currentValue) => {
            if(currentValue.type === "expense"){
                return accumulator + currentValue.amount
            }
            return accumulator;
        }, 0);

        return res.status(200).json({allTransactionsByMonth, sumAllAmountGained, sumAllAmountExpend});

    }catch(err){
        throw new Error(err as string);
    }
}