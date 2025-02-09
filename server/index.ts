import express from "express";
import ENV from './env.json';

const app = express();

app.get("/", (req, res) => {
    res.send("Hello, Express with TypeScript!");
});

app.listen(`${ENV.PORT}`, () => {
    console.log(`Youtube Manage API Server listening on port ${ENV.PORT}`);
});