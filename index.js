const express = require("express");
const app = express();
const screenshot = 'screen.jpg'
const {amazon} = require('./amazon')
const path = require("path")

app.get("/", function (req, res) {
    res.sendFile(path.resolve("./index.html"))
});

app.listen(6969, function () {
});

app.get("/img", function (req, res) {
    res.sendFile(path.resolve("img.html"))
})

app.post("/img", async function (req, res) {
    await amazon(req.query.search)
    res.sendFile(path.resolve("img.html"))
})

app.get("/screen.jpg", function (req, res) {
    res.sendFile(path.resolve(screenshot))
})

