import {Schema} from 'mongoose';

const incomeSchema = new Schema({
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String
    },
    account: {
        type: String,
        required: true
    },
    date_earned: {
        type: Date,
        required: true,
    },
    recurrency: {
        type: String,
        required: true,
        default: 'never'
    }
}); 

export default incomeSchema;