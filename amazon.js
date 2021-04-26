const puppeteer = require('puppeteer')
const screenshot = 'amazon_nyan_cat_pullover.png'
const cherch = 'nyan cat pullover'
try {
    (async () => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.setViewport({ width: 1280, height: 800 })
        await page.goto('https://www.amazon.com')
        await page.type('#twotabsearchtextbox', cherch)
        await page.click('#nav-search-submit-button')
        await delay(4000);
        await page.screenshot({ path: 'amazon_nyan_cat_pullovers_list.png' })
        await browser.close()
    })()
} catch (err) {
    console.error(err)
}

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}