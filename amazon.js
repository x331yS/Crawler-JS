const puppeteer = require("puppeteer");
const screenshot = 'screen.jpg'

async function amazon(str) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.setViewport({width: 1280, height: 800})
    await page.goto('https://www.amazon.com/s?k=' + str)
    await page.screenshot({path: screenshot})
    await browser.close();
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

module.exports = {amazon, delay}
