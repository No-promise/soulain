
  // 全局参数
  // window.JanesiApi.reqUrl = window.reqUrl
  // window.JanesiApi.reqUrl = '//10.10.10.23:8803'

  var baseUrl = '//yun1.janesi.net/janesi-solian/solian-2.1'

  function getRequest() {
    var url = location.href //获取整个地址栏地址
    var theRequest = new Object()
    if (url.indexOf('?') != -1) {
      var str = url.split('?')[1] //截取？之后的所有参数
      str = str.split('&') //将每个参数截取放置到数组
      for (var i = 0; i < str.length; i++) {
        theRequest[str[i].split('=')[0]] = unescape(str[i].split('=')[1]) //将属性及属性值分别归属到数组
      }
    }
    return theRequest
  }

    var userId = getRequest()['userId']
    var authorId = getRequest()['authorId']

  // 隐藏推荐列表来源
  function hiddenComeFrom() {
    setTimeout(function () {
      var comeFrom = document.querySelectorAll('.comeFrom')
      var length = comeFrom.length
      for (var i = 0; i < length; i++) {
        comeFrom[i].style.display = 'none'
      }
    }, 500)
  }

  // 关注开关
  var flagAttention = 0

  // 刷新关注 reloaded
  window.JanesiBridge.commonNativeCallJS = function (res) {
    if (res.action == 'reloaded') {
      confirmAttention()
    }
  }

  // 关注 验证
  var attention = document.querySelector('#attention')
  var attentionStatus = document.querySelector('#attentionStatus')

  function confirmAttention() {
    var url = '/app/soulian/content/is_fans_author'
    var params = {
      userId: userId,
      authorId: authorId
    }
    window.JanesiApi.sendApi(url, 'post',params, function (res) {
      if (res.result == 1) {
        attentionStatus.innerHTML = '已关注'
        attentionStatus.style.cssText = 'color:#333'
        attention.style.cssText = 'background:#ddd'
        flagAttention = 1
      }else{
        attentionStatus.innerHTML = '关注'
        attentionStatus.style.cssText = 'color:#fff'
        attention.style.cssText = 'background:linear-gradient(to right, #4179F7, #65C1FF)'
        flagAttention = 0
      }
    })
  }
  confirmAttention() //调用关注验证

  // 关注
  
  attentionStatus.onclick = function () {
    var fansNum  = document.querySelector('.fans').children[1]
    var fansNums = parseInt(fansNum.innerHTML)
    
    var url = flagAttention == '0' ? '/app/soulian/content/fans_author' : '/app/soulian/content/cancel_fans_author'
    var params = {
      userId: userId,
      authorId: authorId
    }
    window.JanesiApi.sendApi(url, 'post', params, function (res) {
      if (res.code == '0') {
        attentionStatus.innerHTML = flagAttention == '0' ? '已关注' : '关注'
        attentionStatus.style.cssText = flagAttention == '0' ? 'color:#333' : 'color:#fff'
        attention.style.cssText =  flagAttention == '0' ? 'background:#ddd' : 'background:linear-gradient(to right, #4179F7, #65C1FF)'
        fansNum.innerHTML = flagAttention == '0' ? fansNums + 1 : fansNums - 1 < 0 ? '0' : fansNums -1
        flagAttention = flagAttention == '0' ? 1 : 0
        window.JanesiBridge.callNative('attentionItem',{
				  'state': flagAttention
        })
      }
    })
  }

  // 获取作者列表列表
  var pageNo = 1
  window.JanesiApi.sendApi('/app/soulian/content/author_content_list', 'post', {
    userId: userId,
    authorId: authorId,
    operate: 'LOAD',
    pageNo: '1'
  }, function (e) {
    var res = JSON.stringify(e.result.contents)
    localStorage.setItem('totalList', res)
    window.totalList = e.result.contents
    console.log(window.totalList)
    getList(e)
  })

  // 上拉加载
  function getScrollTop() {
    var scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
    return scrollTop;
  }

  function getClientHeight() {
    var clientHeight = 0
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
    } else {
      clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    }
    return clientHeight
  }

  function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
  }

  // 滚动事件触发
  window.onscroll = function () {
    if (getScrollTop() + getClientHeight() >= getScrollHeight()) {
      pageNo++
      var url = '/app/soulian/content/author_content_list'
      var params = {
        userId: userId,
        authorId: authorId,
        operate: 'REFRESH',
        pageNo: pageNo
      }
      window.JanesiApi.sendApi(url, 'post', params, function (res) {
        var reloading = document.querySelector('.reloading')
        reloading.style.display = 'block'
        setTimeout(function () {
          reloading.style.display = 'none'
          getList(res)
          var list = res.result.contents
          var totalList = window.totalList
          window.totalList =totalList.concat(list) 
          hiddenComeFrom()
        }, 1000)
      })
    }
  }

  // 寻找li
  var list = document.getElementById('list')
  list.addEventListener('click', function (ev) {
    var target = ev.target
    while (target !== list) {
      if (target.tagName.toLowerCase() == 'li') {
        var RealItemId = target.getAttribute('itemId')
        var length = window.totalList.length
        for (var i = 0; i < length; i++) {
          if ( window.totalList[i].itemId == RealItemId) {
            console.log(window.totalList[i])
            window.JanesiBridge.callNative('open', {
              'recommendInfo': window.totalList[i]
            })
          }
        }
        break
      }
      target = target.parentNode
    }
  })


window.onload = function () {
  // 通知原生关闭托底图片
  window.JanesiBridge.callNative('isLoaded', {})
  // 隐藏推荐列表来源
  hiddenComeFrom()
}

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
      h5_locaiton: 'contentHomePage'
  }, function (res) {
      console.log('ok')
  })
}
exposure()