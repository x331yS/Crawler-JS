const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const puppeteer = require('puppeteer');
const writeFileAsync = promisify(fs.writeFile);
(async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('https://news.ycombinator.com/news')
    const title = await page.title()
    const infos = await page.$$eval('.storylink', anchors => {
        return anchors.map(anchor => anchor.textContent).slice(0, 20)
    })
    console.log(title+'\n')
    console.log(infos)

    await writeFileAsync(path.join('doc.txt'), title+'\n\n'+ '-'+infos.join('\n-'))

    await browser.close()
})()