const puppeteer = require("puppeteer");
const {delay} = require('./amazon')
const fs = require('fs')
const path = require("path")
const https = require("https");


async function movies(str) {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.setViewport({width: 2000, height: 1000})
    await page.goto("https://www.imdb.com/")
    await page.type('#suggestion-search', str)
    await page.waitForSelector('.ipc-icon--magnify');
    await page.click('.ipc-icon--magnify')
    await page.waitForSelector('img');
    await page.click('img')
    await delay(1000)
    const ratingValue = await page.evaluate(() => {
        return document.querySelector("span[itemprop='ratingValue']").innerText;
    })
    console.log(ratingValue)
    await page.click('img')
    await delay(1000)
    // await page.waitForSelector('img');
    // await page.click(".media-viewer")
    // await page.waitForSelector('.media-viewer');
    // const element = await page.$('.media-viewer');
    // await element.screenshot({path: 'static/movies/img.png'});
    const url = await page.evaluate(() => {
        return document.querySelector(".media-viewer img").src;
    })
    console.log(url)
    https.get(url, (data) => {
        const extension = path.extname(url);
        const stream = fs.createWriteStream(`./static/movies/movie${extension}`);
        data.pipe(stream);
        stream.on("finish", () => {
            stream.close();
        });
    });
    // await page.goto("https://www.imdb.com/")

     //await browser.close()
}

module.exports = {movies}
