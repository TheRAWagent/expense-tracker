"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/expense-tracker";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const connectDB = () => {
    mongoose_1.default.connect(`${MONGO_URL}/transactions`, options).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log("Error connecting to MongoDB");
        console.log(error);
    });
};
exports.default = connectDB;
