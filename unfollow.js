const puppeteer = require('puppeteer');
require('dotenv').config();

//1つのタグについて100人フォローする
autoFollow = async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  
  await page.goto('https://www.instagram.com/accounts/login/?hl=ja&source=auth_switcher', {waitUntil: 'networkidle2'})
  await page.setViewport({ width: 1200, height: 800 });

  await page.waitFor(3000);
  
  //パスワード入力
  await page.type('input[name="username"]', process.env.USERNAME);
  await page.type('input[name="password"]', process.env.PASSWORD);

  //ログインクリック
  await page.waitForSelector('.gr27e > .EPjEi > .HmktE > .bkEs3 > .\_0mzm-')
  await page.click('.gr27e > .EPjEi > .HmktE > .bkEs3 > .\_0mzm-')

  await page.waitFor(5000);

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
    var followerCountNum = Number(followerCount.replace(",", ""))
    if (count >= followerCountNum) {
      break;
    }
    console.log(followerCountNum)
    console.log(count)
    await page.waitFor(200);
  }

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
    var followingCountNum = Number(followingCount.replace(",", ""))
    if (count == followingCountNum) {
      console.log("break")
      break;
    }
    await page.waitFor(200);
    console.log(count)
  }

  await browser.close();
}

autoFollow();