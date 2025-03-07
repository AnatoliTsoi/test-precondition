import express from "express";
import userRoutes from "./routes/userRoutes";
import {errorHandler} from "./controllers/userController";

const app = express();

app.use(express.json());
app.use(userRoutes);
app.get("/health", (req, res) => {
    res.send("Health check passed");
});
app.use(errorHandler); // IT MUST BE THE LAST MIDDLEWARE


export default app;



