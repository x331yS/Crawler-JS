const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const puppeteer = require('puppeteer');
const writeFileAsync = promisify(fs.writeFile);
const {delay} = require('./amazon')
const HURL = "https://www.jeuxvideo.com/jeux/attendus/";

async function games() {
    let browser = await puppeteer.launch({headless:false});
    let page = await browser.newPage();
    await page.setViewport({width: 1366, height: 663});
    await page.goto(HURL);
    await delay(1000)
    await page.click('.jad_cmp_paywall_button-cookies')
    const titleGames = await page.title()
    const page1 = await page.$$eval('.gameTitleLink__196nPy', anchors => {
        return anchors.map(anchor => anchor.textContent).slice(0, 20)
    })
    const data = await page.$$eval(".gameMetadatas__1pxEsA", anchors => {
        return anchors.map((anchor => 'Games : ' + anchor.querySelector("h2").textContent + '</br>Link : ' +
            "<a href="+anchor.querySelector("a")+">" + anchor.querySelector("a") +"</a>" +'</br>'+ 'Description : ' +
            anchor.querySelector("p").innerHTML +'</br>'+ 'Release Date : ' +
            anchor.querySelectorAll("span>.releaseDate__1RvUmc").innerHTML)).slice(0, 5)
    })
    await writeFileAsync(path.join('static/games/games.html'), "<style>* {background: #000; color: #fff;}  .title {font-size: 100px;}</style>" + '</br>' + "<div class='title'>" + titleGames + "</div>" + '</br></br>' + data.join('</br>' ))
    await browser.close()
}

module.exports = {games}


