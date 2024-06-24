import { Schema } from "mongoose";

const accountSchema = new Schema(
  {
    description:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    card_last_numbers:{
        type: String
    },
    bank:{
        type: String,
    },
    date_expire: {
        type: Date
    }
  },
  {
    timestamps: true,
  }
);

export default accountSchema;
