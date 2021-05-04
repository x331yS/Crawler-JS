const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const puppeteer = require('puppeteer');
const writeFileAsync = promisify(fs.writeFile);
const {delay} = require('./amazon')


async function google(str) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.google.com")
    await page.setViewport({width: 1366, height: 663});
    await delay(1000)
    await page.click("#zV9nZe")
    await church(page, "instagram", str)
    await church(page, "facebook", str)
    await church(page, "linkedin", str)
    await church(page, "twitter", str)
    await browser.close()
}

async function church(page, url, str) {
    await page.goto(`https://www.google.com/search?q=${str}+site:${url}.com`, {waitUntil: "networkidle2"});
    const data = await page.$$eval(".yuRUbf > a", anchors => {
        return anchors.map((anchor => 'Information : ' + anchor.querySelector("h3").textContent + '</br>Link : ' + "<a href="+anchor.href+">"+anchor.href +"</a>")).slice(0, 3)
    })
    if (data.length === 0) {
        await writeFileAsync(path.join('static/google/', url + '.html'), "<style>* {color: #fff;}  .title {font-size: 100px;}</style>" + '</br>' + "<div class='title'>" + url.charAt(0).toUpperCase() + url.slice(1) + "</br>No data")
    }
    await writeFileAsync(path.join('static/google/', url + '.html'), "<style>* {color: #fff;}  .title {font-size: 70px;}</style>" + '</br>' + "<div class='title'>" + url.charAt(0).toUpperCase() + url.slice(1) + "</div>" + '</br></br>' + '-' + data.join('</br></br>'))
    return data;
}

module.exports = {google}
