import { Schema } from "mongoose";
import accountSchema from "./AccountSchema";

const expenseSchema = new Schema(
  {
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    account: {
      type: accountSchema,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    payment_terms: {
      type: String,
      required: true,
    },
    installments: {
      type: Number,
    },
    date_expense: {
      type: Date,
      required: true,
    },
    recurrency: {
      type: String,
      required: true,
      default: "never",
    },
  },
  {
    timestamps: true,
  }
);

export default expenseSchema;
