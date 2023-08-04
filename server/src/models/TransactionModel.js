"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    price: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }
});
const Transaction = (0, mongoose_1.model)('Transaction', TransactionSchema);
exports.default = Transaction;
