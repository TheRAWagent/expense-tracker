"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const TransactionModel_1 = __importDefault(require("./models/TransactionModel"));
const ConnectDB_1 = __importDefault(require("./config/ConnectDB"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
(0, ConnectDB_1.default)();
app.get('/api', (req, res) => {
    TransactionModel_1.default.find().then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json(error);
    });
});
app.post('/api/addTransaction', (req, res) => {
    const price = req.body.name.split(" ")[0];
    if (isNaN(Number(price))) {
        res.status(500).json({ message: "Price must be a number" });
        return;
    }
    const name = req.body.name.split(" ").slice(1).join(" ");
    const transaction = new TransactionModel_1.default({
        price: price,
        name: name,
        description: req.body.description,
        date: req.body.date
    });
    transaction.save().then(() => {
        TransactionModel_1.default.find().then((data) => {
            res.status(200).json(data);
        }).catch((error) => {
            res.status(500).json(error);
        });
    }).catch((error) => {
        res.status(500).json(error);
    });
    // res.json(req.body);
});
app.listen(5000, () => {
    console.log("Server is running on port 3000");
});
