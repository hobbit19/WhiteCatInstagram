const puppeteer = require('puppeteer');
require('dotenv').config();

//1つのタグについて200いいねする
autoLike = async () => {
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
  //["いいね返し", "#いいねした人全員フォローする"、"いいね返しは絶対"]
  // let urls = ["https://www.instagram.com/explore/tags/%E3%81%84%E3%81%84%E3%81%AD%E8%BF%94%E3%81%97/?hl=jattps://www.instagram.com/explore/tags/%E3%81%84%E3%81%84%E3%81%AD%E3%81%97%E3%81%9F%E4%BA%BA%E5%85%A8%E5%93%A1%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E3%81%99%E3%82%8B/?hl=ja", 
  //             "https://www.instagram.com/explore/tags/%E3%81%84%E3%81%84%E3%81%AD%E3%81%97%E3%81%9F%E4%BA%BA%E5%85%A8%E5%93%A1%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E3%81%99%E3%82%8B/",
  //             "https://www.instagram.com/explore/tags/%E3%81%84%E3%81%84%E3%81%AD%E8%BF%94%E3%81%97%E3%81%AF%E7%B5%B6%E5%AF%BE/?hl=ja"
  //             ]
  let urls = ["https://www.instagram.com/explore/tags/%E5%84%AA%E6%9F%94%E4%B8%8D%E6%96%AD/"]
  
  //いいねの個数をカウントする
  let likeCount = 0

  //ハッシュタグの数だけループする
  for(var i = 0; i < urls.length; i++) {
    let url = urls[i]
    await page.goto(url, {waitUntil: 'networkidle2'})
    await page.waitFor(3000);

    for (var j = 0; j < 10; j ++) {
      //最近の投稿を取得
      let posts = await page.$$('article > div:nth-child(3) img[decoding="auto"]');

      console.log(posts.length)

      for(let i = 0; i < 20; i++) {
        let post = posts[i];

        //投稿をクリック
        await post.click();
        await page.waitFor(3000);

        //いいねボタンを見つける
        await page.waitFor(1000);
        let isLikable = await page.$('.eo2As > .ltpMr > .fr66n > .dCJp8 > .glyphsSpriteHeart__outline__24__grey_9');
        if (isLikable) {
          likeCount += 1
          console.log(likeCount)
          await page.click('.eo2As > .ltpMr > .fr66n > .dCJp8 > .glyphsSpriteHeart__outline__24__grey_9')
        }
        await page.waitFor(3000)

        //バツボタンをクリック
        await page.waitForSelector('body > .\_2dDPU > .ckWGn')
        await page.click('body > .\_2dDPU > .ckWGn')
      }

      //投稿取得のためにスクロールする
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

autoLike();