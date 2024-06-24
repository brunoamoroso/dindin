import { Schema } from "mongoose";
import accountSchema from "./AccountSchema";

const incomeSchema = new Schema(
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
    date_earned: {
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

export default incomeSchema;
