import express, { type Express, type Request, type Response } from "express";
import fs from "node:fs";

const app = express();
app.use(express.json());
const PORT = 4200;

app.get('/api', (req: Request, res: Response) => {
    const getTransactions = fs.readFileSync("data/transactions.json", "utf-8");
    res.send(JSON.parse(getTransactions));
})

app.post("/api/add", (req: Request, res: Response) => {
    const newTransaction = req.body;
    const getTransactions = fs.readFileSync("data/transactions.json", "utf-8");
    const transactionsList = JSON.parse(getTransactions);
    transactionsList.push(newTransaction);
    fs.writeFileSync("data/transactions.json", JSON.stringify(transactionsList));
    res.send("Added successfully");
})
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
})