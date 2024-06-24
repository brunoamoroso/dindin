import {Schema} from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    }
}); 

export default userSchema;