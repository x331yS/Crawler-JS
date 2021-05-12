const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const puppeteer = require('puppeteer');
const writeFileAsync = promisify(fs.writeFile);

let date = new Date()
let jourSemaine = date.getDay();
if (jourSemaine === 1){
    jourSemaine = 'Lundi'
}
if (jourSemaine === 2){
    jourSemaine = 'Mardi'
}
if (jourSemaine === 3){
    jourSemaine = 'Mercredi'
}
if (jourSemaine === 4){
    jourSemaine = 'Jeudi'
}
if (jourSemaine === 5){
    jourSemaine = 'Vendredi'
}
if (jourSemaine === 6){
    jourSemaine = 'Samedi'
}
if (jourSemaine === 7){
    jourSemaine = 'Dimache'
}
let jourMois = date.getDate();
let mois = date.getMonth();
if (mois === 0){
    mois = 'Janvier'
}
if (mois === 1){
    mois = 'Fevrier'
}
if (mois === 2){
    mois = 'Mars'
}
if (mois === 3){
    mois = 'Avril'
}
if (mois === 4){
    mois = 'Mai'
}
if (mois === 5){
    mois = 'Juin'
}
if (mois === 6){
    mois = 'Juillet'
}
if (mois === 7){
    mois = 'Aout'
}
if (mois === 8){
    mois = 'Septembre'
}
if (mois === 9){
    mois = 'Octobre'
}
if (mois === 10){
    mois = 'Novembre'
}
if (mois === 11){
    mois = 'Decembre'
}
let annee = date.getFullYear();

function hacker() {
    (async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://news.ycombinator.com/news')
        const title = await page.title()
        const infos = await page.$$eval('.storylink', anchors => {
            return anchors.map(anchor => anchor.textContent).slice(0, 20)
        })
        await writeFileAsync(path.join('static/hacker/','hack.html'), "<style>@import url('https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap'); * {background: #fff; color: #000; font-family: 'Poppins' , sans-serif;}  .title {font-size: 100px;}</style>" + '</br>' + "<div class='title'>" + title + "</div>" + '</br></br>' + '-' + infos.join('</br>-'))
        await writeFileAsync(path.join('static/hacker/','hack.txt'), jourSemaine+' '+jourMois+' '+mois+' '+annee+'\n\n'+title + '\n\n' + '-' + infos.join('\n-'))
        await browser.close()
    })()
}

module.exports = {hacker}