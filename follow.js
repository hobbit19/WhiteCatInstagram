const puppeteer = require('puppeteer');
require('dotenv').config();

//1つのタグについて100人フォローする
autoFollow = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.instagram.com/accounts/login/?hl=ja&source=auth_switcher', {waitUntil: 'networkidle2'})
  await page.setViewport({ width: 1200, height: 800 });
  
  //パスワード入力
  await page.type('input[name="username"]', process.env.USERNAME);
  await page.type('input[name="password"]', process.env.PASSWORD);

  //ログインクリック
  await page.waitForSelector('.gr27e > .EPjEi > .HmktE > .bkEs3 > .\_0mzm-')
  await page.click('.gr27e > .EPjEi > .HmktE > .bkEs3 > .\_0mzm-')

  await page.waitFor(3000);



  //ハッシュタグに飛ぶ
  //["フォロー返します", "フォロバ100 "、"相互フォロー", "グルメ"]
  // let urls = ["https://www.instagram.com/explore/tags/%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E8%BF%94%E3%81%97%E3%81%BE%E3%81%99/",
  //             "https://www.instagram.com/explore/tags/%E3%83%95%E3%82%A9%E3%83%AD%E3%83%90100/",
  //             "https://www.instagram.com/explore/tags/%E7%9B%B8%E4%BA%92%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC/"]
  //グルメ
  let urls = ["https://www.instagram.com/explore/tags/%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E8%BF%94%E3%81%97%E3%81%BE%E3%81%99/?hl=ja"]
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
        let isFollowing = await page.$x("//button[contains(text(), 'フォロー中')]");
        console.log(isFollowing.length)
        if (isFollowing.length　== 0) {
          follewCount += 1
          console.log(follewCount)
          await page.waitForSelector('.Ppjfr > .o-MQd > .PQo_0 > .bY2yH > .oW_lN')
          await page.click('.Ppjfr > .o-MQd > .PQo_0 > .bY2yH > .oW_lN')
        }
        await page.waitFor(3000)

        //バツボタンをクリック
        await page.waitForSelector('body > .\_2dDPU > .ckWGn')
        await page.click('body > .\_2dDPU > .ckWGn')
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