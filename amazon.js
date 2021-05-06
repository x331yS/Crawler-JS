const puppeteer = require("puppeteer");
const screenshot = 'static/screen.jpg'

async function amazon(str) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.setViewport({width: 2000, height: 1000})
    await page.goto('https://www.amazon.com/s?k=' + str)
    await delay(1000)
    await page.click('.a-button-input')
    await page.screenshot({path: screenshot})
    await browser.close();
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

module.exports = {amazon, delay}
