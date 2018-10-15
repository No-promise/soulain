
//渲染相关推荐

function getList(e) {
    var baseUrl = 'https://yun1.janesi.net/janesi-solian/solian-2.1';
    var recommendList = e.result.contents;
    window.nowRecommendList = recommendList;
    var detailUrl;
    var length = recommendList.length;
    var templates = {
        'ARTICLENOP': function ARTICLENOP(item) {
            return '\n            <div class="textType wrapper">\n                <div class="textTypeTitle">\n                    ' + item.title + '\n                </div>\n                <div class="correlation row">\n                    <div class="comeFrom">\n                        ' + item.source + '\n                    </div>\n                    <div class="read">\n                        ' + item.count + '\n                    </div>\n                    <div class="readFont">\u9605\u8BFB</div>\n                </div>\n            </div>\n        ';
        },
        'ARTICLELARP': function ARTICLELARP(item) {
            return '\n            <div class="leftText row flex_jcsb">\n                <div class="leftContent wrapper flex_jcsb">\n                    <div class="textTypeTitle">\n                        ' + item.title + '\n                    </div>\n                    <div class="correlation row">\n                        <div class="comeFrom">\n                            ' + item.source + '\n                        </div>\n                        <div class="read">\n                            ' + item.count + '\n                        </div>\n                        <div class="readFont">\u9605\u8BFB</div>\n                    </div>\n                </div>\n                <div class="rightContent">\n                    <img class="smallImg" src="' + item.medias[0].url + '">\n                </div>\n            </div>\n        ';
        },
        'ARTICLE': function ARTICLE(item) {
            return '\n            <div class="leftText row flex_jcsb">\n                <div class="leftContent wrapper flex_jcsb">\n                    <div class="textTypeTitle">\n                        ' + item.title + '\n                    </div>\n                    <div class="correlation row">\n                        <div class="comeFrom">\n                            ' + item.source + '\n                        </div>\n                        <div class="read">\n                            ' + item.count + '\n                        </div>\n                        <div class="readFont">\u9605\u8BFB</div>\n                    </div>\n                </div>\n                <div class="rightContent">\n                    <img class="smallImg" src="' + item.medias[0].url + '">\n                </div>\n            </div>\n        ';
        },
        'ARTICLETWB3P': function ARTICLETWB3P(item) {
            return '\n            <div class="topTextThree wrapper">\n                <div class="textTypeTitle">\n                    ' + item.title + '\n                </div>\n                <div class="threeImg row flex_jcsb">\n                    <img class="smallImg" src="' + item.medias[0].url + '" >\n                    <img class="smallImg" src="' + item.medias[1].url + '" >\n                    <img class="smallImg" src="' + item.medias[2].url + '" >\n                </div>\n                <div class="correlation row">\n                    <div class="comeFrom">\n                        ' + item.source + '\n                    </div>\n                    <div class="read">\n                        ' + item.count + '\n                    </div>\n                    <div class="readFont">\u9605\u8BFB</div>\n                </div>\n            </div>\n        ';
        },
        'VIDEO': function VIDEO(item) {
            return '\n            <div class="topTextThree wrapper">\n                <div class="textTypeTitle">\n                    ' + item.title + '\n                </div>\n                <div class="threeImg row flex_jcsb">\n                    <img class="smallImg" src="' + item.medias[0].url + '" >\n                    <img class="smallImg" src="' + item.medias[1].url + '" >\n                    <img class="smallImg" src="' + item.medias[2].url + '" >\n                </div>\n                <div class="correlation row">\n                    <div class="comeFrom">\n                        ' + item.source + '\n                    </div>\n                    <div class="read">\n                        ' + item.count + '\n                    </div>\n                    <div class="readFont">\u64AD\u653E</div>\n                </div>\n            </div>\n        ';
        },
        'VIDEOLARP': function VIDEOLARP(item) {
            return '\n            <div class="leftText row">\n                <div class="leftContent wrapper flex_jcsb">\n                    <div class="textTypeTitle">\n                        ' + item.title + '\n                    </div>\n                    <div class="correlation row">\n                        <div class="comeFrom">\n                            ' + item.source + '\n                        </div>\n                        <div class="read">\n                            ' + item.count + '\n                        </div>\n                        <div class="readFont">\u64AD\u653E</div>\n                    </div>\n                </div>\n                <div class="rightContent">\n                    <img class="smallImg" src="' + item.medias[0].cutUrl + '">\n                    <div class="timeTip text_center">\n                        ' + item.medias[0].duration + '\n                    </div>\n                </div>\n            </div>\n        ';
        },
        'VIDEOTABP': function VIDEOTABP(item) {
            return '\n            <div class="topTextOne wrapper">\n                <div class="textTypeTitle">\n                     ' + item.title + '\n                </div>\n                <div class="videoCenter">\n                    <img class="bigImg" src="' + item.medias[0].cutUrl + '">\n                    <img class="breakImg" src="https://yun1.janesi.net/janesi-solian/solian-2.1/img/articleAndMv/Oval 2@2x.png" alt="">\n                </div>\n                <div class="correlation row">\n                    <div class="comeFrom">\n                        ' + item.source + '\n                    </div>\n                    <div class="read">\n                         ' + item.count + '\n                    </div>\n                    <div class="readFont">\u64AD\u653E</div>\n                </div>\n            </div>\n        ';
        },
        'AD': function AD(item) {
            return '\n            <div class="text_ad">\n                <div class="ad_top">\n                    <div class="ad_title_font mui-ellipsis-2">' + item.title + '</div>\n                </div>\n                <div class="ad_foot">\n                    <div class="ad_tipShow">\n                        \u5E7F\u544A\n                    </div>\n                    <div class="ad_coin">\n                        <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">\n                        <p class="ad_number">+<span class="plusCoin">' + item.reward + '</span></p>\n                    </div>\n                </div>\n            </div>\n        ';
        },
        'ADNOP': function ADNOP(item) {
            return '\n            <div class="text_ad">\n                <div class="ad_top">\n                    <div class="ad_title_font mui-ellipsis-2">' + item.title + '</div>\n                </div>\n                <div class="ad_foot">\n                    <div class="ad_tipShow">\n                        \u5E7F\u544A\n                    </div>\n                    <div class="ad_coin">\n                        <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">\n                        <p class="ad_number">+<span class="plusCoin">' + item.reward + '</span></p>\n                    </div>\n                </div>\n            </div>\n        ';
        },
        'ADIMAGE': function ADIMAGE(item) {
            return '\n            <div class="big_img_ad">\n                <div class="ad_top">\n                    <div class="ad_title_font mui-ellipsis-2">' + item.title + '</div>\n                </div>\n                <div class="big_main">\n                    <img class="big_one" src="' + item.medias[0].url + '" alt="">\n                </div>\n                <div class="ad_foot">\n                    <div class="ad_tipShow">\n                        \u5E7F\u544A\n                    </div>\n                    <div class="ad_coin">\n                        <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">\n                        <p class="ad_number">+<span class="plusCoin">' + item.reward + '</span></p>\n                    </div>\n                </div>\n            </div>\n        ';
        },
        'ADTWB3P': function ADTWB3P(item) {
            return '\n            <div class="three_img_ad">\n                <div class="ad_top">\n                    <div class="ad_title_font mui-ellipsis-2">' + item.title + '</div>\n                </div>\n                <div class="three_main">\n                    <div class="three_one">\n                        <img class="three_img" src="' + item.medias[0].url + '" alt="">\n                    </div>\n                    <div class="three_two">\n                        <img class="three_img" src="' + item.medias[1].url + '" alt="">\n                    </div>\n                    <div class="three_three">\n                        <img class="three_img" src="' + item.medias[2].url + '" alt="">\n                    </div>\n                </div>\n                <div class="ad_foot">\n                    <div class="ad_tipShow">\n                        \u5E7F\u544A\n                    </div>\n                    <div class="ad_coin">\n                        <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">\n                        <p class="ad_number">+<span class="plusCoin">' + item.reward + '</span></p>\n                    </div>\n                </div>\n            </div>\n        ';
        },
        'ADLARP': function ADLARP(item) {
            return '\n            <div class="left_img_ad">\n                <div class="ad_left">\n                    <div class="ad_title_font mui-ellipsis-2"> ' + item.title + ' </div>\n                    <div class="ad_foot foot_left">\n                        <div class="ad_tipShow">\n                            \u5E7F\u544A\n                        </div>\n                        <div class="ad_coin">\n                            <img class="coinsSrc" src="../icon/welfare_daily_gold@2x.png" alt="">\n                            <p class="ad_number">+<span class="plusCoin">' + item.reward + '</span></p>\n                        </div>\n                    </div>\n                </div>\n                <div class="ad_right">\n                    <img class="three_img" src="' + item.medias[0].url + '" alt="">\n                </div>\n            </div>\n        ';
        }
    };
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < length; i++) {
        var item = recommendList[i];
        if (item.count.length >= 5) {
            item.count = item.count.substr(0, item.count.length - 4) + '万';
        }
        var li = document.createElement('li');
        li.setAttribute('itemId', item.itemId);
        li.setAttribute('lid', i);
        var fn = templates[item.contentType + (item.layout || '')];
        li.innerHTML = fn(item);
        fragment.appendChild(li);
    }
    document.getElementById('list').appendChild(fragment);

    // 判断金币是否展现
    var plusCoins = document.querySelectorAll('.plusCoin');
    for (var i = 0; i < plusCoins.length; i++) {
        if (plusCoins[i].innerHTML == '0' || plusCoins[i].innerHTML == 'null') {
            //    console.log(plusCoins[i])
            //    console.log(plusCoins[i].parentNode.parentNode.parentNode )
            var coinFather = plusCoins[i].parentNode.parentNode.parentNode;
            var removeCoin = plusCoins[i].parentNode.parentNode;
            coinFather.removeChild(removeCoin);
        }
    }
}