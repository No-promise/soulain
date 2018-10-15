
  // 放开文章
  var showContent = document.getElementById('article')
  var seeMore = document.getElementById('seeMore')
  var readMore = document.querySelector('.readMore')
  var clientHeight = window.innerHeight
  if (showContent.offsetHeight >= 6 * clientHeight) {
    showContent.style.height = 2 * clientHeight + 'px'
    seeMore.style.display = 'block'
  }
  readMore.onclick = function () {
    showContent.style.height = 'auto'
    seeMore.style.display = 'none'
  }

  // 通知原生 文章滚动
  var pageY1, pageY2
  document.addEventListener('touchstart', function (e) {
    var touch = event.targetTouches[0]
    pageY1 = touch.pageY
  }, false)
  document.addEventListener('touchmove', function (e) {
    var touch = event.targetTouches[0]
    pageY2 = touch.pageY
  }, false)

  document.addEventListener('touchend', function (e) {
    console.log(Math.abs(pageY2 - pageY1))
    if (Math.abs(pageY2 - pageY1) >= 5 && Math.abs(pageY2 - pageY1) <= 100) {
      window.JanesiBridge.callNative('scrollNumbers', {})
    }
  }, false)

  // 曝光
function exposure() {
  // window.JanesiApi.reqUrl = "//118.25.10.151:8808"
  var myDate = new Date().getTime()
  JanesiApi.trackApi('/log/spm', 'get', {
      eventType: 'show',
      eventTime: myDate,
      end_type: 'h5',
      // url: window.location.href,
      referrer: '',
      h5_locaiton: 'articleDetail'
  }, function (res) {
      console.log('ok')
  })
}
exposure()