import express, { type Express, type Request, type Response } from "express";
import fs from "node:fs";

const app = express();
app.use(express.json());
const PORT = 4200;

app.get("/api", (req: Request, res: Response) => {
    
})

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
})