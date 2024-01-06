import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';
import Transaction from "./models/TransactionModel"
import connectDB from './config/ConnectDB';
import * as z from 'zod'
import cors from 'cors';

connectDB();
const appRouter = router({
  getTransactions: publicProcedure.query(async () => {
    try{
        const Transactions = await Transaction.find();
        return Transactions;
    }
    catch(error){
        return error;
    }

  }),
  addTransaction: publicProcedure.input(
    z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
    })
  ).query(async (opts) => {
    const {name,description,date}: {name: string,description: string,date: string} = opts.input;
    const parsedDate = new Date(date);
    const price = name.split(" ")[0];
    if (isNaN(Number(price))) {
        return {message: "Price must be a number"};
    }
    const ExpenseName = name.split(" ").slice(1).join(" ");

    const transaction = new Transaction({
        price: price,
        name: ExpenseName,
        description: description,
        date: parsedDate
    });
    await transaction.save();
    const Transactions = await Transaction.find();
    return Transactions;
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  middleware: cors()

});

server.listen(443);