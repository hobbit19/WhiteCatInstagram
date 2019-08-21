const puppeteer = require('puppeteer');
require('dotenv').config();

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

　//フォロー中の人をとってくる
  await page.waitForSelector('.vtbgv > .zwlfE > .k9GMp > .Y8-fY:nth-child(3) > .-nal3')
  await page.click('.vtbgv > .zwlfE > .k9GMp > .Y8-fY:nth-child(3) > .-nal3')
  await page.waitFor(5000);

  let unfollowCount = 0
  for(let k = 1; k < 10; k++) {
    await page.evaluate((k) => {
        document.getElementsByClassName("ZUqME")[k].getElementsByClassName("_0mzm-")[0].click()
    })
    //   await page.waitForSelector('.RnEpo > .pbNvD > .piCib > .mt3GC > .-Cab_', {timeout: 0})
    //   await page.click('.RnEpo > .pbNvD > .piCib > .mt3GC > .-Cab_')
    await page.waitFor(15000)
  }
  await browser.close();
}

autoFollow();