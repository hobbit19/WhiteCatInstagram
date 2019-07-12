const puppeteer = require('puppeteer');
require('dotenv').config();

//1つのタグについて100人フォローする
autoFollow = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
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



  //ハッシュタグに飛ぶ
  //#白猫
  // let urls = ["https://www.instagram.com/explore/tags/%E7%99%BD%E7%8C%AB/?hl=ja"]
  //#猫好きさんと繋がりたい
  let urls = ["https://www.instagram.com/explore/tags/%E7%8C%AB%E5%A5%BD%E3%81%8D%E3%81%95%E3%82%93%E3%81%A8%E7%B9%8B%E3%81%8C%E3%82%8A%E3%81%9F%E3%81%84/?hl=ja"]
  //フォローした回数をカウントする
  let follewCount = 0

  //ハッシュタグの数だけループする
  for(var i = 0; i < urls.length; i++) {
    let url = urls[i]
    await page.goto(url, {waitUntil: 'networkidle2'})
    await page.waitFor(3000);

    for (var j = 0; j < 20; j ++) {
      //最近の投稿を取得
      let posts = await page.$$('article > div:nth-child(3) img[decoding="auto"]');
      console.log("posts count")
      console.log(posts.length)

      for(let i = 0; i < 10; i++) {
        let post = posts[i];

        //投稿をクリック
        await post.click();
        await page.waitFor(3000);

        //フォローボタンを見つける
        await page.waitFor(1000);
        // let follow = await page.$('.Ppjfr > .o-MQd > .PQo_0 > .bY2yH > .oW_lN');
        let toFollow = await page.$x("//button[contains(text(), 'フォローする')]");
        console.log(toFollow.length)
        if (toFollow.length == 2) {
          follewCount += 1
          console.log(follewCount)
          await page.waitForSelector('.Ppjfr > .o-MQd > .PQo_0 > .bY2yH > .oW_lN')
          await page.click('.Ppjfr > .o-MQd > .PQo_0 > .bY2yH > .oW_lN')
        }
        await page.waitFor(3000)

        //バツボタンをクリック
        await page.waitForSelector('body > .\_2dDPU > .ckWGn')
        await page.click('body > .\_2dDPU > .ckWGn')

        if (follewCount == 70) {
          break;
        }
      }

      // 投稿取得のためにスクロールする
      await page._client.send(
        'Input.synthesizeScrollGesture',
        {
          x: 0,
          y: 0,
          xDistance: 0,
          yDistance: -1500,
          repeatCount: 3,
          repeatDelayMs: 200
        }
      );
    }
  }

  await browser.close();
}

autoFollow();