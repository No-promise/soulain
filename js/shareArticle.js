$(function () {
  // 点击打开
  var openApp = document.querySelector('.openApp')
  openApp.onclick = function () {
    window.location.href='//yun1.janesi.net/janesi-solian/solian-2.1/templates/download.html' 
  }
  // 判断ostype
  var osType
        if (window.JanesiBridge.isAndroid) {
            osType='ANDROID'
        } else {
            osType='IOS'
        }
    // 曝光
  function exposure() {
    window.JanesiApi.reqUrl = "//118.25.10.151:8808"
    let myDate = new Date().getTime()
    JanesiApi.sendApi('/log/spm', 'get', {
        appId:'10012',
        osType: osType,
        eventType:'show',
        eventTime: myDate,
        end_type:'h5',
        url: window.location.href,
        referrer:'',
        h5_locaiton:'shareArticle'
    }, function (res) {
        console.log('ok')
    })
  }
  exposure()
})