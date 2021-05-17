const path = require("path");
const puppeteer = require('puppeteer');
const fs = require('fs')
const {promisify} = require('util')
const writeFileAsync = promisify(fs.writeFile);
const https = require("https");

function crawl(item)  {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 2500, height: 2500, deviceScaleFactor: 1})
        await page.goto('https://rl.insider.gg/fr/xbox/' + item);
        await page.waitForSelector('#graphContainer')
        const element = await page.$('#graphContainer')
        await element.screenshot({path: 'static/picture/graph.png'});
        const item_name = await page.evaluate(() => {
            return document.querySelector("#itemNameSpan").innerText;
        })
        const item_price = await page.evaluate(() => {
            return document.querySelector("#itemSummaryPrice").innerHTML;
        })
        const url = await page.evaluate(() => {
            return document.querySelector("#itemSummaryImage > img").src;
        })
        https.get(url, (data) => {
            const extension = path.extname(url);
            const stream = fs.createWriteStream(`./static/picture/img${extension}`);
            data.pipe(stream);
            stream.on("finish", () => {
                stream.close();
            });
        });

        await browser.close
        await writeFileAsync(path.join('static/result/','index.html'), "<!DOCTYPE html>\n" +
            "<html>\n" +
            "\n" +
            "<head>\n" +
            "  <link rel=\"stylesheet\" type=\"text/css\" href=\"../css/style.css\" />\n" +
            "</head>\n" +
            "\n" +
            "<body>\n" +
            "<div class=\"secondDiv card\">\n" +
            " <div class=\"flex\">\n" +
            " <img src=\"../picture/img.jpg\" class=\"imgDisplay\">" +
            "  <div class=\"flex-lines\"><div id=\"itemsearched\" class=\"title\" >\n" +
            "  " + item_name + "</div> \n" +
            "  <div class=\"flex-lines\"><div id=\"itemsearched\" class=\"price\" >\n" +
            "  " + item_price + "</div> \n" +
            " </div></div>\n"+
            "  <img src=\"../picture/graph.png\" class=\"center graphDisplay\" id=\"graphic\">\n" +
            "</div>\n" +
            "\n" +
            "</body>\n" +
            "</html>")
    })();
}
module.exports = {crawl}