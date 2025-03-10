import express from "express";
import userRoutes from "./routes/userRoutes";
import {errorHandler} from "./controllers/userController";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(express.json());
app.use(userRoutes);
app.get("/health", (req, res) => {
    res.send("Health check passed");
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler); // IT MUST BE THE LAST MIDDLEWARE


export default app;



