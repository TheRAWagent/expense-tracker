import {model, Schema } from "mongoose";

const TransactionSchema = new Schema({
    price:{type: Number,required: true},
    name: {type: String,required: true},
    description: {type: String,required: true},
    date: {type: Date,required: true}
})


const Transaction = model('Transaction', TransactionSchema);

export default Transaction;