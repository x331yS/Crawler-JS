const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const puppeteer = require('puppeteer');
const writeFileAsync = promisify(fs.writeFile);
const {delay} = require('./amazon')
const HURL = "https://www.jeuxvideo.com/jeux/attendus/";

async function games() {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.setViewport({width: 2000, height: 1000})
    await page.goto(HURL);
    await delay(1000)
    await page.click('.jad_cmp_paywall_button-cookies')
    const titleGames = await page.title()
    const data = await page.$$eval(".gameMetadatas__1pxEsA", anchors => {
        return anchors.map(anchor => '</br>Link : ' +
            "<a target=\"_blank\" href="+anchor.querySelector("a")+">"+ 'Link to following Games'+'</a>' +
            anchor.innerHTML).slice(0, 20)
    })
    await writeFileAsync(path.join('static/games/games.html'), "<style>@import url('https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap'); * {background: #fff; color: #000; font-family: 'Poppins' , sans-serif;}  .title {font-size: 100px;}</style>" + '</br>' + "<div class='title'>" + titleGames + "</div>" + '</br></br>' + data.join('</br></br></br></br>' ))
    await browser.close()
}

module.exports = {games}



