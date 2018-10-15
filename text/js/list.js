//渲染相关推荐

function getList(e) {
  var baseUrl = 'https://yun1.janesi.net/janesi-solian/solian-2.1'
  var recommendList = e.result.contents
  window.nowRecommendList = recommendList
  var detailUrl
  var length = recommendList.length
  var templates = {
    'ARTICLENOP': (item) => {
      return `
            <div class="textType wrapper">
                <div class="textTypeTitle">
                    ${item.title}
                </div>
                <div class="correlation row">
                    <div class="comeFrom">
                        ${item.source}
                    </div>
                    <div class="read">
                        ${item.count}
                    </div>
                    <div class="readFont">阅读</div>
                </div>
            </div>
        `
    },
    'ARTICLELARP': (item) => {
      return `
            <div class="leftText row flex_jcsb">
                <div class="leftContent wrapper flex_jcsb">
                    <div class="textTypeTitle">
                        ${item.title}
                    </div>
                    <div class="correlation row">
                        <div class="comeFrom">
                            ${item.source}
                        </div>
                        <div class="read">
                            ${item.count}
                        </div>
                        <div class="readFont">阅读</div>
                    </div>
                </div>
                <div class="rightContent">
                    <img class="smallImg" src="${item.medias[0].url}">
                </div>
            </div>
        `
    },
    'ARTICLE': (item) => {
      return `
            <div class="leftText row flex_jcsb">
                <div class="leftContent wrapper flex_jcsb">
                    <div class="textTypeTitle">
                        ${item.title}
                    </div>
                    <div class="correlation row">
                        <div class="comeFrom">
                            ${item.source}
                        </div>
                        <div class="read">
                            ${item.count}
                        </div>
                        <div class="readFont">阅读</div>
                    </div>
                </div>
                <div class="rightContent">
                    <img class="smallImg" src="${item.medias[0].url}">
                </div>
            </div>
        `
    },
    'ARTICLETWB3P': (item) => {
      return `
            <div class="topTextThree wrapper">
                <div class="textTypeTitle">
                    ${item.title}
                </div>
                <div class="threeImg row flex_jcsb">
                    <img class="smallImg" src="${item.medias[0].url}" >
                    <img class="smallImg" src="${item.medias[1].url}" >
                    <img class="smallImg" src="${item.medias[2].url}" >
                </div>
                <div class="correlation row">
                    <div class="comeFrom">
                        ${item.source}
                    </div>
                    <div class="read">
                        ${item.count}
                    </div>
                    <div class="readFont">阅读</div>
                </div>
            </div>
        `
    },
    'VIDEO': (item) => {
      return `
            <div class="topTextThree wrapper">
                <div class="textTypeTitle">
                    ${item.title}
                </div>
                <div class="threeImg row flex_jcsb">
                    <img class="smallImg" src="${item.medias[0].url}" >
                    <img class="smallImg" src="${item.medias[1].url}" >
                    <img class="smallImg" src="${item.medias[2].url}" >
                </div>
                <div class="correlation row">
                    <div class="comeFrom">
                        ${item.source}
                    </div>
                    <div class="read">
                        ${item.count}
                    </div>
                    <div class="readFont">播放</div>
                </div>
            </div>
        `
    },
    'VIDEOLARP': (item) => {
      return `
            <div class="leftText row">
                <div class="leftContent wrapper flex_jcsb">
                    <div class="textTypeTitle">
                        ${item.title}
                    </div>
                    <div class="correlation row">
                        <div class="comeFrom">
                            ${item.source}
                        </div>
                        <div class="read">
                            ${item.count}
                        </div>
                        <div class="readFont">播放</div>
                    </div>
                </div>
                <div class="rightContent">
                    <img class="smallImg" src="${item.medias[0].cutUrl}">
                    <div class="timeTip text_center">
                        ${item.medias[0].duration}
                    </div>
                </div>
            </div>
        `
    },
    'VIDEOTABP': (item) => {
      return `
            <div class="topTextOne wrapper">
                <div class="textTypeTitle">
                     ${item.title}
                </div>
                <div class="videoCenter">
                    <img class="bigImg" src="${item.medias[0].cutUrl}">
                    <img class="breakImg" src="https://yun1.janesi.net/janesi-solian/solian-2.1/img/articleAndMv/Oval 2@2x.png" alt="">
                </div>
                <div class="correlation row">
                    <div class="comeFrom">
                        ${item.source}
                    </div>
                    <div class="read">
                         ${item.count}
                    </div>
                    <div class="readFont">播放</div>
                </div>
            </div>
        `
    },
    'AD': (item) => {
      return `
            <div class="text_ad">
                <div class="ad_top">
                    <div class="ad_title_font mui-ellipsis-2">${item.title}</div>
                </div>
                <div class="ad_foot">
                    <div class="ad_tipShow">
                        广告
                    </div>
                    <div class="ad_coin">
                        <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">
                        <p class="ad_number">+<span class="plusCoin">${item.reward}</span></p>
                    </div>
                </div>
            </div>
        `
    },
    'ADNOP': (item) => {
      return `
            <div class="text_ad">
                <div class="ad_top">
                    <div class="ad_title_font mui-ellipsis-2">${item.title}</div>
                </div>
                <div class="ad_foot">
                    <div class="ad_tipShow">
                        广告
                    </div>
                    <div class="ad_coin">
                        <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">
                        <p class="ad_number">+<span class="plusCoin">${item.reward}</span></p>
                    </div>
                </div>
            </div>
        `
    },
    'ADIMAGE': (item) => {
      return `
            <div class="big_img_ad">
                <div class="ad_top">
                    <div class="ad_title_font mui-ellipsis-2">${item.title}</div>
                </div>
                <div class="big_main">
                    <img class="big_one" src="${item.medias[0].url}" alt="">
                </div>
                <div class="ad_foot">
                    <div class="ad_tipShow">
                        广告
                    </div>
                    <div class="ad_coin">
                        <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">
                        <p class="ad_number">+<span class="plusCoin">${item.reward}</span></p>
                    </div>
                </div>
            </div>
        `
    },
    'ADTWB3P': (item) => {
      return `
            <div class="three_img_ad">
                <div class="ad_top">
                    <div class="ad_title_font mui-ellipsis-2">${item.title}</div>
                </div>
                <div class="three_main">
                    <div class="three_one">
                        <img class="three_img" src="${item.medias[0].url}" alt="">
                    </div>
                    <div class="three_two">
                        <img class="three_img" src="${item.medias[1].url}" alt="">
                    </div>
                    <div class="three_three">
                        <img class="three_img" src="${item.medias[2].url}" alt="">
                    </div>
                </div>
                <div class="ad_foot">
                    <div class="ad_tipShow">
                        广告
                    </div>
                    <div class="ad_coin">
                        <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">
                        <p class="ad_number">+<span class="plusCoin">${item.reward}</span></p>
                    </div>
                </div>
            </div>
        `
    },
    'ADLARP': (item) => {
      return `
            <div class="left_img_ad">
                <div class="ad_left">
                    <div class="ad_title_font mui-ellipsis-2"> ${item.title} </div>
                    <div class="ad_foot foot_left">
                        <div class="ad_tipShow">
                            广告
                        </div>
                        <div class="ad_coin">
                            <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">
                            <p class="ad_number">+<span class="plusCoin">${item.reward}</span></p>
                        </div>
                    </div>
                </div>
                <div class="ad_right">
                    <img class="three_img" src="${item.medias[0].url}" alt="">
                </div>
            </div>
        `
    }
  }
  var fragment = document.createDocumentFragment()
  for (var i = 0; i < length; i++) {
    var item = recommendList[i]
    if (item.count.length >= 5) {
      item.count = item.count.substr(0, item.count.length - 4) + '万'
    }
    var li = document.createElement('li')
    li.setAttribute('itemId', item.itemId)
    li.setAttribute('lid', i)
    var fn = templates[item.contentType + (item.layout || '')]
    li.innerHTML = fn(item)
    fragment.appendChild(li)
  }
  document.getElementById('list').appendChild(fragment)

  // 判断金币是否展现
  var plusCoins = document.querySelectorAll('.plusCoin')
  for (var i = 0; i < plusCoins.length; i++) {
    if (plusCoins[i].innerHTML == '0' || plusCoins[i].innerHTML == 'null') {
      //    console.log(plusCoins[i])
      //    console.log(plusCoins[i].parentNode.parentNode.parentNode )
      var coinFather = plusCoins[i].parentNode.parentNode.parentNode
      var removeCoin = plusCoins[i].parentNode.parentNode
      coinFather.removeChild(removeCoin)
    }
  }
}