
// 全局参数
// window.JanesiApi.reqUrl = window.reqUrl 
// window.JanesiApi.reqUrl = "http://10.10.10.23:8803"
// window.JanesiApi.reqUrl = "https://118.25.10.151:8803"
window.JanesiApi.reqUrl = "http://10.10.10.81:8803"
console.log(window.JanesiApi.reqUrl)

var baseUrl = 'https://yun1.janesi.net/janesi-solian/solian-2.1';

function getRequest() {
  var url = location.href; //获取整个地址栏地址
  var theRequest = new Object();
  if (url.indexOf('?') != -1) {
    var str = url.split('?')[1]; //截取？之后的所有参数
    str = str.split('&'); //将每个参数截取放置到数组
    for (var i = 0; i < str.length; i++) {
      theRequest[str[i].split('=')[0]] = unescape(str[i].split('=')[1]); //将属性及属性值分别归属到数组
    }
  }
  return theRequest;
}

// 请求参数
var userId = getRequest()['userId'];
var itemId = getRequest()['itemId'];
var contentType = getRequest()['contentType'];
var osType = getRequest()['osType'];
var urlSource = getRequest()['urlSource'];
var keyword = getRequest()['keyword']
console.log(keyword)

// 页面加载完毕
window.onload = function () {
  // 通知原生关闭托底图片
  window.JanesiBridge.callNative('isLoaded', {});
};

// 开关
var flagAttention = 0;
var flagPraise = 0;
var flagCollect = 0;

// 跳转内容号页面
var goAuthorPage = document.querySelector('.goAuthorPage');
var linkurl = goAuthorPage.getAttribute('linkurl');
  // 判断是否有作者
if(linkurl==''){
  document.querySelector('#autherAvator').style.display = 'none';
}else {
  goAuthorPage.onclick = function () {
    var authorUrl = {
      'url': linkurl
    };
    window.JanesiBridge.callNative('open', authorUrl);
  };
}


// // 刷新关注 reloaded
// window.JanesiBridge.commonNativeCallJS = function (res) {
//   if (res.action == 'reloaded') {
//     confirmAttention();
//   }
// };

// 关注
// 关注 验证
// var attention = document.querySelector('#attention');
// var attentionStatus = document.querySelector('#attentionStatus');
// var authorid = document.querySelector('.goAuthorPage').getAttribute('authorid');

// function confirmAttention() {
//   window.JanesiApi.sendApi('/app/soulian/content/is_fans_author', 'post', {
//     userId: userId,
//     authorId: authorid
//   }, function (e) {
//     if(linkurl==''){
//       attention.style.cssText = 'background:#fff';
//     }else{
//       if (e.result == 1) {
//         attentionStatus.innerHTML = '已关注';
//         attentionStatus.style.cssText = 'color:#333';
//         attention.style.cssText = 'background:#ddd';
//         flagAttention = 1;
//       } else {
//         attentionStatus.innerHTML = '关注';
//         attentionStatus.style.cssText = 'color:#fff';
//         attention.style.cssText = 'background:linear-gradient(to right, #4179F7, #65C1FF)';
//         flagAttention = 0;
//       }
//     }
    
//   });
// }
// confirmAttention(); //调用关注验证

// // 关注
// attention.onclick = function () {

//   var url = flagAttention == '0' ? '/app/soulian/content/fans_author' : '/app/soulian/content/cancel_fans_author';
//   var params = {
//     userId: userId,
//     authorId: authorid
//   };
//   window.JanesiApi.sendApi(url, 'post', params, function (res) {
//     if (res.code == '0') {
//       attentionStatus.innerHTML = flagAttention == '0' ? '已关注' : '关注';
//       attentionStatus.style.cssText = flagAttention == '0' ? 'color:#333' : 'color:#fff';
//       attention.style.cssText = flagAttention == '0' ? 'background:#ddd' : 'background:linear-gradient(to right, #4179F7, #65C1FF)';
//       flagAttention = flagAttention == '0' ? 1 : 0;
//       window.JanesiBridge.callNative('attentionItem', {
//         'state': flagAttention
//       });
//     }
//   });
// };

// 弹框出现
function showToast() {
  document.querySelector('.toast').style.display = 'block';
  setTimeout(function () {
    document.querySelector('.toast').style.display = 'none';
  }, 500);
}
// 点赞加算力 弹框
var myDate = new Date();
var comeTime = myDate.getTime();
console.log(comeTime)

function showAdd(){
  document.querySelector('.calculationToast').style.display = 'block';
  setTimeout(function () {
    document.querySelector('.calculationToast').style.display = 'none';
  }, 500);
}

// 点赞验证
var amount = document.querySelector('.amount');
var clickPraise = document.querySelector('#clickPraise');
var islike = amount.getAttribute('islike');
var amountNum = parseInt(amount.innerHTML);
if (islike == 1) {
  amount.style.color = "#4179F7";
  clickPraise.src = baseUrl + '/img/articleAndMv/Rectangle 2@2x.png';
  clickPraise.parentNode.style.border = '1px solid #4179F7';
  flagPraise = 1;
}

// 点赞
var praise = document.querySelector('.clickPraise');
var addCalculationNum = document.querySelector('.addCalculationNum');
praise.addEventListener('click',function(){
   var amountNum = parseInt(amount.innerHTML);
   var params = {
    userId: userId,
    itemId: itemId,
    contentType: contentType,
    osType: osType,
    urlSource: urlSource,
    keyword: keyword,
    userBehaviorByContent: flagPraise == '0' ? 'LIKE' : 'CANCEL_LIKE'
  };
  var clickDate = new Date();
  var clickTime = clickDate.getTime();
  var difference = clickTime - comeTime;
  console.log(difference)
  if(difference>=3000){
    document.querySelector('.toast').style.cssText=""
    if(flagPraise == '0'){
      window.JanesiApi.sendApi('/app/soulian/content/user_behavior', 'post', params, function (res) {
        if (res.code == '0') {
            amount.innerHTML = amountNum + 1;
            amount.style.color = "#4179F7";
            clickPraise.src = baseUrl + '/img/articleAndMv/Rectangle 2@2x.png';
            clickPraise.parentNode.style.border = '1px solid #4179F7';
            flagPraise = 1;
            if(res.result.powerCount==0){
              document.querySelector('.toast').innerHTML = '点赞成功';
              showToast();
            }else{
              addCalculationNum.innerHTML = res.result.powerCount;
              showAdd();
            }
        }
      })
    }else {
      window.JanesiApi.sendApi('/app/soulian/content/user_behavior', 'post', params, function (res) {
        if (res.code == '0') {
            amount.innerHTML = amountNum - 1 < 0 ? '0' : amountNum - 1;
            amount.style.color = "#999";
            clickPraise.src = baseUrl + '/img/articleAndMv/Rectangle-path2@2x.png';
            clickPraise.parentNode.style.border = '1px solid #999';
            flagPraise = 0;
            document.querySelector('.toast').innerHTML = '取消点赞';
              showToast();
        }
      })
    }
  }else {
    var toast = document.querySelector('.toast');
    toast.style.width = 218 +'px';
    toast.style.marginLeft = -104 +'px';
    toast.innerHTML = '别着急，看看再决定';
    showToast();
  }
   
})


// 收藏验证
var state = document.querySelector('#state');
var collect = document.querySelector('#collect');
var isCollect = state.getAttribute('iscollect');
if (isCollect == 1) {
  state.style.color = "#F5A623";
  state.innerHTML = '已收藏';
  collect.src = baseUrl + '/img/articleAndMv/Rectangle1@2x.png';
  state.parentNode.style.border = '1px solid #F5A623';
  flagCollect = 1;
}

// 收藏
var collectArticle = document.querySelector('.collectArticle');
collectArticle.onclick = function () {
  var url = flagCollect == '0' ? '/app/soulian/content/user_behavior' : '/app/soulian/content/user_behavior';
  var params = {
    userId: userId,
    itemId: itemId,
    contentType: contentType,
    osType: osType,
    urlSource: urlSource,
    keyword: keyword,
    userBehaviorByContent: flagCollect == '0' ? 'COLLECT' : 'CANCEL_COLLECT'
  };
  window.JanesiApi.sendApi(url, 'post', params, function (res) {
    if (res.code == '0') {
      state.style.color = flagCollect == '0' ? '#F5A623' : '#999';
      state.innerHTML = flagCollect == '0' ? '已收藏' : '收藏';
      collect.src = baseUrl + (flagCollect == '0' ? '/img/articleAndMv/Rectangle1@2x.png' : '/img/articleAndMv/Rectangle-path1@2x.png');
      state.parentNode.style.border = flagCollect == '0' ? '1px solid #F5A623' : '1px solid #999';
      flagCollect = flagCollect == '0' ? 1 : 0;
      document.querySelector('.toast').innerHTML = flagCollect == '0' ? '取消收藏' : '收藏成功';
      showToast();
      window.JanesiBridge.callNative('collectionItem', {
        'state': flagCollect
      });
    }
  });
};

// 举报
var report = document.querySelector('.report');
report.onclick = function () {
  window.JanesiBridge.callNative('open', {
    'page': "inform"
  });
};

// 获取相关推荐列表
var tittle = document.querySelector('.tittle').innerHTML;
var url = '/app/soulian/content/relevance';
var params = {
  userId: userId,
  itemId: itemId,
  contentType: contentType,
  osType: osType,
  title: tittle,
  urlSource: urlSource,
  keyword: keyword
};
window.JanesiApi.sendApi(url, 'post', params, function (e) {
  getList(e);
});

var list = document.getElementById('list');
list.addEventListener('click', function (ev) {
  var target = ev.target;
  while (target !== list) {
    if (target.tagName.toLowerCase() == 'li') {
      var index = target.getAttribute('lid');
      window.JanesiBridge.callNative('open', {
        'recommendInfo': window.nowRecommendList[index]
      });
      break;
    }
    target = target.parentNode;
  }
});