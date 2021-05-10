const express = require("express");
const app = express();
const favicon = require('serve-favicon')
const {amazon} = require('./amazon')
const {google} = require('./google')
const {imdb} = require('./movies')
const {hacker} = require('./hackerNews')
const {games} = require('./games')
const path = require("path")

app.get("/", function (req, res) {
    hacker()
    games()
    res.sendFile(path.resolve("static","index.html"))
});

app.post("/amazon", async function (req, res) {
    await amazon(req.query.search)
    res.redirect("/amazon")
});

app.post("/google", async function (req, res) {
    await google(req.query.search)
    res.redirect("/google")
});

app.post("/movies", async function (req, res) {
    await imdb(req.query.search)
    res.redirect("/movies")
});

app.use("/",express.static(path.resolve("static")))
app.use(favicon(path.join('static/bot.ico')))

app.listen(6969, function () {
    console.log("http://localhost:6969")
});