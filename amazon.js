const puppeteer = require("puppeteer");

async function amazon(str) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage()
    await page.setViewport({width: 1700, height: 2000})
    await page.goto('https://www.amazon.com/s?k=' + str)
    await delay(1000)
    await page.click('.a-button-input')
    await page.screenshot({path : 'static/amazon/amazon.jpg'})
    await browser.close();
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

module.exports = {amazon, delay}
