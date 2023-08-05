import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Transaction from "./models/TransactionModel"
import ConnectDB from "./config/ConnectDB";



const app: express.Application = express();
app.use(bodyParser.json());
app.use(cors());
ConnectDB();

app.get('/', (req, res) => {
    res.redirect(process.env.CLIENT_URL || "localhost:5173");
})

app.get('/api', (req, res) => {
    Transaction.find().then((data) => {
        res.status(200).json(data);
    }
    ).catch((error) => {
        res.status(500).json(error);
    }
    )

})

app.post('/api/addTransaction', (req, res) => {
    const price = req.body.name.split(" ")[0];
    if (isNaN(Number(price))) {
        res.status(500).json({ message: "Price must be a number" });
        return;
    }
    const name = req.body.name.split(" ").slice(1).join(" ");

    const transaction = new Transaction({
        price: price,
        name: name,
        description: req.body.description,
        date: req.body.date
    });
    transaction.save().then(() => {
        Transaction.find().then((data) => {
            res.status(200).json(data);
        }
        ).catch((error) => {
            res.status(500).json(error);
        }
        )   
    }).catch((error) => {
        res.status(500).json(error);
    })


    // res.json(req.body);
}
)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})