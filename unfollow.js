const puppeteer = require('puppeteer');
require('dotenv').config();
const spreadsheet = require("./spreadsheet.js");

//name = document.getElementsByClassName("wo9IH")[0].getElementsByClassName("wFPL8")[0].textContent
//button = document.getElementsByClassName("wo9IH")[0].getElementsByClassName("_0mzm-")[0]

//1つのタグについて100人フォローする
autoFollow = async () => {
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

  //フォロー中の人数を取得
  var followingCount = await page.$eval("#react-root > section > main > div > header > section > ul > li:nth-child(3) > a > span", item => {
    return item.textContent;
  })
  console.log(followingCount)

  //フォロワーの人数を取得
  let followerCount = await page.$eval("#react-root > section > main > div > header > section > ul > li:nth-child(2) > a > span", item => {
    return item.textContent
  })
  console.log(followerCount)

  //フォロワーの人をとってくる
  await page.waitForSelector("#react-root > section > main > div > header > section > ul > li:nth-child(2) > a")
  await page.click("#react-root > section > main > div > header > section > ul > li:nth-child(2) > a")
  await page.waitFor(5000);

  for (var j = 0; j < 100000; j ++) {
    await page.evaluate(() => {
        document.querySelector('.isgrP').scrollBy(0,1000);
    });
    let count = await page.evaluate(() => {
        return document.querySelectorAll('.wo9IH').length
    });
    var followerCountNum = Number(followerCount.replace(",", "")) - 1
    if (count >= followerCountNum) {
      break;
    }
    console.log(followerCountNum)
    console.log(count)
    await page.waitFor(200);
  }

  //フォロワーの名前を配列にぶち込む
  const followerNames = await page.evaluate(() => Array.from(document.getElementsByClassName("FPmhX"), e => e.innerText))
  console.log(followerNames)
  console.log(followerNames.length)

  // バツボタンをクリック
  await page.waitForSelector('div > .eiUFA > .WaOAr > .dCJp8 > .glyphsSpriteX__outline__24__grey_9')
  await page.click('div > .eiUFA > .WaOAr > .dCJp8 > .glyphsSpriteX__outline__24__grey_9')


　//フォロー中の人をとってくる
  await page.waitForSelector('.vtbgv > .zwlfE > .k9GMp > .Y8-fY:nth-child(3) > .-nal3')
  await page.click('.vtbgv > .zwlfE > .k9GMp > .Y8-fY:nth-child(3) > .-nal3')
  await page.waitFor(5000);

  for (var j = 0; j < 100000; j ++) {
    await page.evaluate(() => {
        document.querySelector('.isgrP').scrollBy(0,1000);
    });
    let count = await page.evaluate(() => {
        return document.querySelectorAll('.wo9IH').length
    });
    var followingCountNum = Number(followingCount.replace(",", "")) - 3
    console.log(followerCountNum)
    if (count >= followingCountNum) {
      console.log("break")
      break;
    }
    await page.waitFor(200);
    console.log(count)
  }

  //フォロー中の名前を配列にぶち込む
  const followingCellsCount = await page.evaluate(() => document.getElementsByClassName("wo9IH").length)
  console.log(followingCellsCount)

  let unfollowCount = 0
  for(let k = 0; k < followingCellsCount; k++) {
    let name = await page.evaluate((k) => document.getElementsByClassName("wo9IH")[k].getElementsByClassName("wFPL8")[0].textContent)
    if (followerNames.includes(name)) {
      console.log("follower")
    } else {
      console.log("unfollow")
      spreadsheet.writeTo([name])
      // await page.evaluate((k) => {
      //   document.getElementsByClassName("wo9IH")[k].getElementsByClassName("_0mzm-")[0].click()
      // })
      // await page.waitForSelector('.RnEpo > .pbNvD > .piCib > .mt3GC > .-Cab_', {timeout: 0})
      // await page.click('.RnEpo > .pbNvD > .piCib > .mt3GC > .-Cab_')
      unfollowCount += 1
    }

    // if (unfollowCount == 70) {
    //   console.log("break")
    //   break;
    // }
  }
  await browser.close();
}

autoFollow();