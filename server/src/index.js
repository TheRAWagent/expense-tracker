"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@trpc/server/adapters/standalone");
const trpc_1 = require("./trpc");
const TransactionModel_1 = __importDefault(require("./models/TransactionModel"));
const ConnectDB_1 = __importDefault(require("./config/ConnectDB"));
const z = __importStar(require("zod"));
const cors_1 = __importDefault(require("cors"));
(0, ConnectDB_1.default)();
const appRouter = (0, trpc_1.router)({
    getTransactions: trpc_1.publicProcedure.query(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const Transactions = yield TransactionModel_1.default.find();
            return Transactions;
        }
        catch (error) {
            return error;
        }
    })),
    addTransaction: trpc_1.publicProcedure.input(z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
    })).query((opts) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description, date } = opts.input;
        const parsedDate = new Date(date);
        const price = name.split(" ")[0];
        if (isNaN(Number(price))) {
            return { message: "Price must be a number" };
        }
        const ExpenseName = name.split(" ").slice(1).join(" ");
        const transaction = new TransactionModel_1.default({
            price: price,
            name: ExpenseName,
            description: description,
            date: parsedDate
        });
        yield transaction.save();
        const Transactions = yield TransactionModel_1.default.find();
        return Transactions;
    })),
});
(0, standalone_1.createHTTPServer)({
    router: appRouter,
    middleware: (0, cors_1.default)(),
    //Listen on the /api endpoint
}).listen(443);
