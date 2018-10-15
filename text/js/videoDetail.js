
  // 原生通知H5
  window.JanesiBridge.commonNativeCallJS = function (res) {
    if (res.action == 'videoStart') {
      
      document.getElementById('myvideo').play()
      confirmAttention()
    } else if (res.action == 'videoStop') {
      document.getElementById('myvideo').pause()
    }
  }

  

  // 视频暂停
  document.getElementById('myvideo').addEventListener('pause', function () {
    window.JanesiBridge.callNative('videoPause', {})
  })
  // 任务
  var isPostNativeMessagePlay = false
  document.getElementById('myvideo').addEventListener('play', function () {
    window.JanesiBridge.callNative('videoPlay', {})
  })
  document.getElementById('myvideo').addEventListener('timeupdate', function () {
    if (!isPostNativeMessagePlay) {
      window.JanesiBridge.callNative('videoPlay', {})
      isPostNativeMessagePlay = true
    }
  })

  // 曝光
function exposure() {
  window.JanesiApi.reqUrl = "//118.25.10.151:8808"
  let myDate = new Date().getTime()
  JanesiApi.trackApi('/log/spm', 'get', {
      eventType: 'show',
      eventTime: myDate,
      end_type: 'h5',
      // url: window.location.href,
      referrer: '',
      h5_locaiton: 'videoDetail'
  }, function (res) {
      console.log('ok')
  })
}
exposure()