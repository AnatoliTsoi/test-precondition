import swaggerJSDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Test Precondition API",
            version: "1.0.0",
            description: "API for preparing state for test scenarios",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server"
            }
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);