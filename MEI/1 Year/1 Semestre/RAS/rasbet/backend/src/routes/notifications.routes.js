const express = require("express");

const notifsRouter = express.Router();

notifsRouter.get("/", async (_req, res) => {
    const msg = {
        msg: "GET request to /notifications",
    };
    return res.status(200).send(msg);
});

notifsRouter.post("/", async (req, res) => {
    const msg = {
        msg: "POST request to /notifications",
        data: req.body,
    };
    return res.status(200).send(msg);
});

exports.notifsRouter = notifsRouter;
