const express = require("express");

const functionsRouter = express.Router();

functionsRouter.get("/", async (_req, res) => {
    const msg = {
        msg: "GET request to /functions",
    };
    return res.status(200).send(msg);
});

functionsRouter.post("/", async (req, res) => {
    const msg = {
        msg: "POST request to /functions",
        data: req.body,
    };
    return res.status(200).send(msg);
});

exports.functionsRouter = functionsRouter;