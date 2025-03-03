import express, { Request, Response } from "express";
import dotenv from "dotenv"

//here we configure the app

dotenv.config()
const app = express()


app.get("/", (req: Request, res: Response) => {
    res.send("Precondition server is running");
});


export default app;