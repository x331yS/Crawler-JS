const puppeteer = require("puppeteer");
const {delay} = require('./amazon')
const fs = require('fs')
const path = require("path")
const https = require("https");

async function imdb(str) {
    metaScore(str)
    price(str)
    allocine(str)
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({width: 1900, height: 1000})
    await page.goto(`https://www.imdb.com/find?q=${str}`)
    await delay(4000);
    await page.click('.primary_photo')
    await delay(3000)
    const ratingValue = await page.evaluate(() => {
        return document.querySelector("span[itemprop='ratingValue']").innerText;
    })
    const title = await page.evaluate(() => {
        return document.querySelector("div[class='title_wrapper'] > h1").innerText;
    })
    const time = await page.evaluate(() => {
        return document.querySelector("div[class='subtext'] > time").innerText;
    })
    // let pls = page.document.querySelector("div[id='titleAwardsRanks']") !== null;
    // if (pls) {
    let top = await page.evaluate(() => {
        return document.querySelector("div[id='titleAwardsRanks']").innerText;
    })
    // }else {
    //     top = "No top ranking"
    // }
    const ratingNumber = await page.evaluate(() => {
        return document.querySelector('span[itemprop="ratingCount"]').innerText;
    })
    console.log("Titre :", title)
    console.log('Temps :', time)
    console.log("Note", ratingValue)
    console.log("Rank", top)
    console.log("Nb de vote ", ratingNumber)


    await page.click('img')
    await delay(3000)
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
    await browser.close()
}

async function metaScore(str) {
    const newBrowser = await puppeteer.launch()
    const metascorepage = await newBrowser.newPage()
    await delay(3000)
    await metascorepage.goto(`https://www.metacritic.com/search/all/${str}/results`)
    await delay(10000)
    await metascorepage.click("#onetrust-accept-btn-handler")
    await delay(4000)
    const metaScore = await metascorepage.evaluate(() => {
        return document.querySelector(".main_stats > span").innerText;
    })
    await metascorepage.click("h3 > a")// .product_title
    await metascorepage.waitForSelector('.distribution');
    const nbCritique = await metascorepage.evaluate(() => {
        return document.querySelector(".based_on").innerText;
    })
    await delay(2000)
    const element = await metascorepage.$('#nav_to_metascore');
    await element.screenshot({path: 'static/movies/metascoreditrib.png'})
    console.log(metaScore)
    console.log(nbCritique)

    await newBrowser.close()
}

async function price(str) {
    const price = await puppeteer.launch();
    const page = await price.newPage()
    await page.goto(`https://www.amazon.com/s?k=${str}+film`)
    await delay(1000)
    await page.click('.a-button-input')
    const prix = await page.evaluate(() => {
        return document.querySelector(".a-offscreen").innerText;
    })
    console.log(prix)
    await price.close();
}

async function allocine(str) {
    const allo = await puppeteer.launch();
    const page = await allo.newPage()
    await page.goto(`https://www.allocine.fr/rechercher/?q=${str}`)
    await delay(1000)
    await page.click('.jad_cmp_paywall_button-cookies')
    const date = await page.evaluate(() => {
        return document.querySelector(".date").innerText;
    })
    const director = await page.evaluate(() => {
        return document.querySelector(".meta-body-direction").innerText;
    })
    const actor = await page.evaluate(() => {
        return document.querySelector(".meta-body-actor").innerText;
    })
    await page.click('.meta-title-link')
    await page.waitForSelector(".content-txt")
    const synopsis = await page.evaluate(() => {
        return document.querySelector(".content-txt").innerText;
    })
    console.log(director)
    console.log(actor)
    console.log(synopsis)
    console.log(date)
    await allo.close()
}

module.exports = {imdb}

