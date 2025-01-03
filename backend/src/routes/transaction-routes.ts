import express from "express";
import {
  addTransaction,
  deleteOneInstallmentTransaction,
  deleteAllInstallmentsTransaction,
  deleteTransaction,
  getAllInstallmentsTransaction,
  getAllTransactionsByMonth,
  getOneTransaction,
  updateAllInstallmentsTransaction,
  updateTransaction,
} from "../controllers/transactions-controller";
import { checkToken } from "../utils/check-token";

const transactionRoutes = express.Router();

transactionRoutes.get(
  "/all-month/:selectedDate",
  checkToken,
  getAllTransactionsByMonth
);
transactionRoutes.get("/:id", checkToken, getOneTransaction);
transactionRoutes.get(
  "/all-installments/:id",
  checkToken,
  getAllInstallmentsTransaction
);
transactionRoutes.post("/add", checkToken, addTransaction);
transactionRoutes.delete(
  "/delete/one-installment/:id",
  checkToken,
  deleteOneInstallmentTransaction
);
transactionRoutes.delete(
  "/delete/all-installment/:id",
  checkToken,
  deleteAllInstallmentsTransaction
);
transactionRoutes.delete("/delete/:id", checkToken, deleteTransaction);
transactionRoutes.put(
  "/update/all-installments/:id",
  checkToken,
  updateAllInstallmentsTransaction
);
transactionRoutes.put("/update/:id", checkToken, updateTransaction);

export default transactionRoutes;
