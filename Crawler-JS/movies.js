const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const puppeteer = require('puppeteer');
const writeFileAsync = promisify(fs.writeFile);
const {delay} = require('./amazon')
const https = require("https");

async function movies(str) {
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
    let top = await page.evaluate(() => {
        let pls = document.querySelector("div[id='titleAwardsRanks']") !== null;
        if (pls) {
            return document.querySelector("div[id='titleAwardsRanks']").innerText;
        } else {
            top = "No top ranking"
        }
    })
    const ratingNumber = await page.evaluate(() => {
        return document.querySelector('span[itemprop="ratingCount"]').innerText;
    })
    await page.click('img')
    await delay(3000)
    const url = await page.evaluate(() => {
        return document.querySelector(".media-viewer img").src;
    })
    https.get(url, (data) => {
        const extension = path.extname(url);
        const stream = fs.createWriteStream(`./static/movies/movie${extension}`);
        data.pipe(stream);
        stream.on("finish", () => {
            stream.close();
        });
    });
    await browser.close()
    console.log("imdb")
    let metaScore = " No metaScore"
    let nbCritique = " No critique"
    if (str === "harry potter") {
        const newBrowser = await puppeteer.launch()
        const metascorepage = await newBrowser.newPage()
        await delay(3000)
        str = str.replace(" ", "%20")
        await metascorepage.goto(`https://www.metacritic.com/search/all/${str}/results`)
        await delay(6000)
        await metascorepage.evaluate(() => {
            let pls = document.querySelector("#onetrust-accept-btn-handler") !== null;
            if (pls == null) {
                delay(15000)
            }
        })
        await metascorepage.waitForSelector("#onetrust-accept-btn-handler")
        await metascorepage.click("#onetrust-accept-btn-handler")
        await delay(4000)
        const metaScore = await metascorepage.evaluate(() => {
            return document.querySelector(".main_stats > span").innerText;
        })
        await metascorepage.click("h3 > a")// .product_title
        await metascorepage.waitForSelector('.distribution');
        let nbCritique = await metascorepage.evaluate(() => {
            return document.querySelector(".based_on").innerText;
        })
        await delay(2000)
        const element = await metascorepage.$('#nav_to_metascore');
        await element.screenshot({path: 'static/movies/metascoreditrib.png'})

        await newBrowser.close()
    }
    console.log("metascore")
    const price = await puppeteer.launch();
    const pricepage = await price.newPage()
    await pricepage.goto(`https://www.amazon.com/s?k=${str}+film`)
    await delay(5000)
    await pricepage.evaluate(() => {
        let pls = document.querySelector(".a-button-input") !== null;
        if (pls == null) {
            delay(15000)
        }
    })
    await pricepage.click('.a-button-input')
    const prix = await pricepage.evaluate(() => {
        return document.querySelector(".a-offscreen").innerText;
    })
    await price.close();
    console.log("amazon")
    const allo = await puppeteer.launch();
    const allopage = await allo.newPage()
    await allopage.goto(`https://www.allocine.fr/rechercher/?q=${str}`)
    await delay(1000)
    await allopage.click('.jad_cmp_paywall_button-cookies')
    const date = await allopage.evaluate(() => {
        return document.querySelector(".date").innerText;
    })
    const director = await allopage.evaluate(() => {
        return document.querySelector(".meta-body-direction").innerText;
    })
    const actor = await allopage.evaluate(() => {
        return document.querySelector(".meta-body-actor").innerText;
    })
    await allopage.click('.meta-title-link')
    await allopage.waitForSelector(".content-txt")
    const synopsis = await allopage.evaluate(() => {
        return document.querySelector(".content-txt").innerText;
    })
    await allo.close()
    console.log("allocine")
    const yobrowser = await puppeteer.launch();
    const youpage = await yobrowser.newPage()
    await youpage.goto(`https://www.youtube.com/results?search_query=${str}+trailer`)
    await delay(1000)
    await youpage.click("button >.VfPpkd-Jh9lGc")
    await delay(3000)
    await youpage.click(".yt-img-shadow")
    const youtubeUrl = await youpage.url();
    let youtubehurle = youtubeUrl.replace("watch?v=", "embed/");
    await yobrowser.close()
    console.log("youtube")
    await writeFileAsync(path.join(`static/movies/page.html`), "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "</head>\n" +
        "<style>\n" +
        "    * {\n" +
        "        margin: 0px;\n" +
        "        font-family: 'Poppins', sans-serif;\n" +
        "    }\n" +
        "\n" +
        "    body {\n" +
        "        text-align: center;\n" +
        "        background: #000;\n" +
        "        padding: 4%;\n" +
        "    }\n" +
        "    h3 {\n" +
        "        color: #fff;\n" +
        "    }\n" +
        "    h1 {\n" +
        "        font-size: 20px;\n" +
        "        color: #fff;\n" +
        "        padding: 20px;\n" +
        "    }\n" +
        "    h1:hover {\n" +
        "        color: red;\n" +
        "    }\n" +
        "\n" +
        "    h2 {\n" +
        "        color: #fff;\n" +
        "        padding: 10px;\n" +
        "    }\n" +
        "    img {\n" +
        "        position: relative;\n" +
        "    }\n" +
        "    iframe {\n" +
        "        position: relative;\n" +
        "    }\n" +
        "    .object {\n" +
        "        left: 400px;\n" +
        "        top: 800px;\n" +
        "\n" +
        "\n" +
        "            }\n" +
        "\n" +
        "</style>\n" +
        "<body>\n" +
        "\n" +
        "<div>\n" +
        "    <h2>" + title + "</br>Time of the movie : " + time + "</h2>\n" +
        "    </br>\n"+
        "    <h3>" + synopsis + "</h3>\n" +
        "    </br>\n"+
        "    <h3>This movie was released "+ date +"</h3>\n" +
        "    <img src=\"movie.jpg\" height=\"800\" width=\"561\">\n" +
        "    <iframe width=\"1050\" height=\"800\" src='" + youtubehurle + "' frameborder=\"0\"\n" +
        "            allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\"\n" +
        "            allowfullscreen></iframe>\n" +
        "    <a href=\"movie.jpg\">\n" +
        "        <h2>Screen shot link</h2></a>\n" +
        "    <h3>Production : "+ director+"</h3>\n" +
        "    <h3>Actor : "+ actor+"</h3>\n" +
        "    </br>\n"+
        "    <h3>Amazon price : "+ prix+"</h3>\n" +
        "    </br>\n"+
        "    <h2>Score</h2>\n"+
        "    </br>\n"+
        "    <h3>Reward : "+ top +" with "+ ratingNumber+"rating</h3>\n" +
        "    </br>\n"+
        "    <h3>Imdb Score on imdb.com : "+ ratingValue +"/10</h3>\n" +
        "    </br>\n"+
        "    <h3>MetaScore on metacritique.com : "+ metaScore +"/100 "+ nbCritique+"</h3>\n" +
        "    </br>\n"+
        "    <h3>Critique exemple on metacritique.com :</h3>\n" +
        "    </br>\n"+
        "    <img src=\"metascoreditrib.png\">\n" +

        "</div>\n" +
        "\n" +
        "\n" +
        "</body>\n" +
        "</html>")
}

// async function metaScore(str) {
//     const newBrowser = await puppeteer.launch()
//     const metascorepage = await newBrowser.newPage()
//     await delay(3000)
//     await metascorepage.goto(`https://www.metacritic.com/search/all/${str}/results`)
//     await delay(6000)
//     await metascorepage.click("#onetrust-accept-btn-handler")
//     await delay(4000)
//     const metaScore = await metascorepage.evaluate(() => {
//         return document.querySelector(".main_stats > span").innerText;
//     })
//     await metascorepage.click("h3 > a")
//     await metascorepage.waitForSelector('.distribution');
//     const nbCritique = await metascorepage.evaluate(() => {
//         return document.querySelector(".based_on").innerText;
//     })
//     await delay(2000)
//     const element = await metascorepage.$('#nav_to_metascore');
//     await element.screenshot({path: 'static/movies/metascoreditrib.png'})
//     console.log(metaScore)
//     console.log(nbCritique)
//
//     await newBrowser.close()
// }
//
// async function price(str) {
//     const price = await puppeteer.launch();
//     const pricepage = await price.newPage()
//     await pricepage.goto(`https://www.amazon.com/s?k=${str}+film`)
//     await delay(4000)
//     await pricepage.click('.a-button-input')
//     const prix = await pricepage.evaluate(() => {
//         return document.querySelector(".a-offscreen").innerText;
//     })
//     console.log(prix)
//     await price.close();
// }
//
// async function allocine(str) {
//     const allo = await puppeteer.launch();
//     const allopage = await allo.newPage()
//     await allopage.goto(`https://www.allocine.fr/rechercher/?q=${str}`)
//     await delay(1000)
//     await allopage.click('.jad_cmp_paywall_button-cookies')
//     const date = await allopage.evaluate(() => {
//         return document.querySelector(".date").innerText;
//     })
//     const director = await allopage.evaluate(() => {
//         return document.querySelector(".meta-body-direction").innerText;
//     })
//     const actor = await allopage.evaluate(() => {
//         return document.querySelector(".meta-body-actor").innerText;
//     })
//     await allopage.click('.meta-title-link')
//     await allopage.waitForSelector(".content-txt")
//     const synopsis = await allopage.evaluate(() => {
//         return document.querySelector(".content-txt").innerText;
//     })
//     console.log(director)
//     console.log(actor)
//     console.log(synopsis)
//     console.log(date)
//     await allo.close()
// }
//
// async function youtube(str) {
//     const yobrowser = await puppeteer.launch();
//     const youpage = await yobrowser.newPage()
//     await youpage.goto(`https://www.youtube.com/results?search_query=${str}+trailer`)
//     await delay(1000)
//     await youpage.click("button >.VfPpkd-Jh9lGc")
//     await delay(3000)
//     await youpage.click(".yt-img-shadow")
//     const youtubeUrl = await youpage.url();
//     console.log(youtubeUrl);
//     await yobrowser.close()
// }

module.exports = {movies}
