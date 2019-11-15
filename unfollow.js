const puppeteer = require('puppeteer');
require('dotenv').config();
// const spreadsheet = require("./spreadsheet.js");

//name = document.getElementsByClassName("wo9IH")[0].getElementsByClassName("wFPL8")[0].textContent
//button = document.getElementsByClassName("wo9IH")[0].getElementsByClassName("_0mzm-")[0]

//1つのタグについて100人フォローする
autoFollow = async () => {

  const fs = require('fs');
  const msg = fs.readFileSync("unfollowlist.txt", {encoding: "utf-8"});
  let unfollowlist = msg.split('\n').filter(item => item != '');

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  let cookies =[{
    "domain": ".instagram.com",
    "expirationDate": process.env.EXPIRATIONDATE,
    "hostOnly": false,
    "httpOnly": true,
    "name": "sessionid",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": process.env.VALUE,
    "id": 9
  }]

  page.setCookie(...cookies)

  //プロフィールに遷移する
  let url = "https://www.instagram.com/whitenekko"
  await page.goto(url, {waitUntil: 'networkidle2'})
  await page.waitFor(3000);

   for (let j = 0; j < unfollowlist.length; j++) {
     console.log(unfollowlist[j]);
      await page.goto(unfollowlist[j]);
      await page.waitFor(3000);
      await page.waitForSelector('.nZSzR > .Igw0E > .BY3EC > .vBF20 > .\_5f5mN', {timeout: 3000})
      await page.click('.nZSzR > .Igw0E > .BY3EC > .vBF20 > .\_5f5mN')
      
      await page.waitForSelector('.RnEpo > .pbNvD > .piCib > .mt3GC > .-Cab_', {timeout: 3000})
      await page.click('.RnEpo > .pbNvD > .piCib > .mt3GC > .-Cab_')    
   }

//   let unfollowCount = 0
//   for(let k = 0; k < followingCellsCount; k++) {
//     let name = await page.evaluate((k) => document.getElementsByClassName("wo9IH")[k].getElementsByClassName("wFPL8")[0].textContent)
//     if (followerNames.includes(name)) {
//       console.log("follower")
//     } else {
//       console.log("unfollow")
//       spreadsheet.writeTo([name])
//       await page.evaluate((k) => {
//         document.getElementsByClassName("wo9IH")[k].getElementsByClassName("_0mzm-")[0].click()
//       })
//       await page.waitForSelector('.RnEpo > .pbNvD > .piCib > .mt3GC > .-Cab_', {timeout: 0})
//       await page.click('.RnEpo > .pbNvD > .piCib > .mt3GC > .-Cab_')
//       unfollowCount += 1
//     }

//     // if (unfollowCount == 70) {
//     //   console.log("break")
//     //   break;
//     // }
//   }
//   await browser.close();
}

autoFollow();