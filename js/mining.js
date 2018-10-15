new Vue({
    el: '#root',
    data: {
        // 用户信息
        initData:{},
        //服务器
        // api:'https://yun1.janesi.net',
        api:'https://yun.janesi.com',
        //页面链接
        pageUrl:{
            wallet:'/janesi-solian/solian-2.1/templates/wallet.html',
            task:'/janesi-solian/solian-2.1/templates/task.html',
            white_paper:'/janesi-solian/solian-2.1/templates/white_paper.html',
            sugar:'/janesi-solian/solian-2.1/templates/sugar.html'
        },
        //数据埋点
        track:{
            wallet:'wallet_button',
            task:'power_button',
            white_paper:'declare_button',
            sugar:'act_button',
            author:'user_icon',
            mining:'mining_detail',
            toLogin:'login_detail'
        },
        //公告
        noticeCon:'世界上除了相互喜欢 其他的喜欢都是伤害 愿余下岁月燃梦祝歌 愿所有伤痛焚诗祭酒',
        // 钻石左右位置去重集合
        leftPosition:[],
        topPosition:[],
        //收取成功新手提示
        successHit:false,
        //手势提示
        handShow:false,
        // 登录状态
        isLogin:false,
        // 判断新手任务开关
        noviceFlag:false,
        //一颗一颗收取
        chargeSwitch:true,
        // 挖矿状态
        minState:false,
        jewelState:false,
        //手势位置
        handLeft:'0',
        handTop:'0',
        // 倒计时背景
        bgWith:'',
        count_down:'',
        // 倒计时总时间
        allTime:'7200',
        // 钻石收取位置
        jewelLeft:'',
        jewelTop:'',
        // 钻石数据
        jewelData:[],
        timerTask:''
    },
    created: function () {
        this.site_init();
        // this.getUserData();
        // this.getData()
        this.getLoginState();
    },
    mounted: function () {
        this.reload();
        this.exposure('show','mining')
    },
    watch: {
        'jewelData':function (val,old) {
            // console.log(val,old)
        }
    },
    methods: {
        // 数据埋点
        exposure(eventType,param) {
            // window.JanesiApi.reqUrl = "http://118.25.10.151:8808/log/spm"
            var that = this;
            var myDate = new Date().getTime();
            JanesiApi.trackApi('/log/spm', 'get', {
                eventType: eventType,
                eventTime: myDate,
                end_type: 'h5',
                url: window.location.href,
                referrer: '',
                h5_locaiton: that.track[param]
            }, function (res) {
                console.log('ok')
            })
        },
        reload () {
            var _this = this;
            window.JanesiBridge.commonNativeCallJS = function (res) {
                console.log(res);
                if (res.action == 'reloaded') {
                     _this.getLoginState();
                }
            }
        },
        //判断是否需要新手引导
        noviceGuide () {
            var _this= this;
            window.JanesiBridge.callNativeWithCallBack('shouldShowGuide',{
                "position":'SLK'
            },function(res){
                console.log(res);
                if(res.show == '1'){
                    _this.noviceFlag = true;
                }
                _this.getData();
            })
        },
        // 判断是否登录
        getLoginState () {
            var _this= this;
            window.JanesiBridge.callNativeWithCallBack('getUserInfo',{},function(res){
                //callback 通知原生返回回调，获取登陆与否的状态,将状态存到loginState
                console.log(res);
                _this.jewelData = [];
                _this.topPosition = [];
                _this.leftPosition = [];
                if(res.loginState == '0'){
                    _this.minState = false;
                    _this.handShow = false;
                    _this.jewelState = false;
                    _this.isLogin = true;
                    _this.initData = {
                        avator:"../img/Group 17@2x.png",
                        nickName:"登录查看",
                        totalPower:"0",
                        totalSlk:"0"
                        };
                    }else{
                        _this.isLogin = false;
                        _this.minState = false;
                        _this.getUserData();
                        _this.noviceGuide();
                    }
            });
        },
        // 获取用户信息
        getUserData () {
            var _this= this;
            // window.JanesiApi.reqUrl = 'http://10.10.11.41:8803';
            JanesiApi.sendApi('/app/soulian/slk/slk_info', 'post', {
                // userId:'1336'
            }, function (res) {
                console.log(res);
                _this.initData = res.result;
            })
        },
        //获取钻石数据
        getData () {
            var _this= this;
            // _this.noviceFlag = true;
            // window.JanesiApi.reqUrl = 'http://10.10.11.41:8803';
            JanesiApi.sendApi('/app/soulian/slk/mining_info', 'post', {
                // userId:'1336',
                // appVersion:'1.0.0'
            }, function (res) {
                console.log(res.result);
                if(res.result.completeSlk.length == '0'){
                    window.JanesiBridge.callNative('miningComplete',{});
                    _this.jewelState = false;
                    if(_this.timerTask){
                        clearInterval(_this.timerTask);
                    }
                    // _this.count_down = '';
                    _this.time(res.result.residueTime);
                    _this.minState = true
                }else{
                    _this.chargeSwitch = true;
                    _this.jewelState = true;
                    _this.jewelData = res.result.completeSlk;
                    _this.de_weight(_this.jewelData.length);
                    if(_this.noviceFlag){
                        _this.handShow = true;
                    }
                }
            })
        },
        //页面跳转
        linkTo (params) {
            // 新手引导
            if(params == 'successHit'){
                $('.begin_guidance').css({display:'none'});
                window.JanesiBridge.callNativeWithCallBack('shouldShowGuideFinish',{
                    "position":'SLK'
                },function(res){});
                return
            }
            // 未登录状态点击算力跳转登录页面
            if(params == 'task' && this.isLogin){
                params = 'toLogin';
            }
            this.exposure('click',params);
            //打开H5页面与打开原生页面
            if(params == 'toLogin' || params =='author'){
                window.JanesiBridge.callNative('open',{page: params});
            }else{
                if(params == 'sugar'){
                    window.JanesiBridge.callNative('open',{url: this.api+this.pageUrl[params]});
                }else{
                    window.JanesiBridge.callNative('open',{url: this.api+this.pageUrl[params],data:{needFullScreen:'1'}});
                }
            }
        },
        // 钻石位置去重
        checkPosition (lefts, tops) {
            for(var i = 0; i < this.topPosition.length; i++) {
                if(Math.abs(this.topPosition[i] - tops) < 100 && Math.abs(this.leftPosition[i] - lefts) < 42) {
                    return true;
                }
            }
        },
        // 钻石位置去重
        de_weight (val) {
            var minBack = document.querySelector('.minBox');
            for (var i=0;i<val;i++){
                var lefts, tops;
                do {
                    lefts = (minBack.offsetWidth - 85) * Math.random() + 25;
                    tops = (minBack.offsetHeight - 160) * Math.random() + 40;
                } while (this.checkPosition(lefts, tops));
                this.leftPosition.push(lefts);
                this.topPosition.push(tops);
                if(this.leftPosition.length == '1'){
                    this.handLeft = parseInt(this.leftPosition[0])+58;
                    this.handTop = parseInt(this.topPosition[0])+60;
                }
            }
        },
        // 点击收取钻石
        click (param,index) {
            var _this = this;
            if(_this.chargeSwitch){
                _this.chargeSwitch = !_this.chargeSwitch;
                _this.handShow = false;
                $('#jewel'+index).animate({
                    left: _this.jewelLeft+'px',
                    top: '0',
                    opacity:'0'
                }, 'slow', 'linear', function() {
                    // document.getElementById('music').play();
                    // window.JanesiApi.reqUrl = 'http://10.10.11.41:8803';
                    JanesiApi.sendApi('/app/soulian/slk/collect', 'post', {
                        // userId:'1336',
                        slkId :param.id
                    }, function (res) {
                        document.getElementById('music').play();
                        if(res.code == '0'){
                            $('#jewel'+index).css({opacity:'1'});
                            if(_this.noviceFlag){
                                _this.noviceFlag = false;
                                // _this.successHit = true;
                                $('.begin_guidance').css({display:'block'});
                            }
                            _this.initData.totalSlk = (parseFloat(_this.initData.totalSlk) + parseFloat(param.slkNum)).toFixed(5);
                        }
                        _this.jewelData = _this.jewelData.filter(function(item,indexs,array){
                            //元素值，元素的索引，原数组。
                            return (indexs != index);
                        });
                        _this.leftPosition = _this.leftPosition.filter(function(item,indexs,array){
                            return (indexs != index);
                        });
                        _this.topPosition = _this.topPosition.filter(function(item,indexs,array){
                            return (indexs != index);
                        });
                        _this.chargeSwitch = !_this.chargeSwitch;
                        if(_this.jewelData.length == '0'){
                            _this.getData ()
                        }
                    })
                })
            }
        },
        //  开采倒计时
        time (param) {
            this.timeInit(param);
            var _this = this;
            var totalTime = parseInt(param);
            this.timerTask = setInterval(function () {
                totalTime -= 1;
                if(totalTime == '0') {
                    clearInterval(this.timerTask);
                    _this.minState = false;
                    _this.getData ();
                }else{
                    _this.timeInit(totalTime);
                }
            }, 1000)
        },
        //初始化倒计时状态
        timeInit (param) {
            var totalTime = parseInt(param);
            this.bgWith = ((parseInt(this.allTime)-totalTime)/parseInt(this.allTime)*100).toFixed(2)+'%';
            var hour = '0' + Math.floor(totalTime / (60 * 60)) + ':';
            param = totalTime % (60 * 60);
            var minute = Math.floor(param / 60) < 10 ? '0' + Math.floor(param / 60) : Math.floor(param / 60);
            param = totalTime % 60;
            var second = param < 10 ? '0' + param : param;
            this.count_down = hour + minute + ':' + second;
        },
        //初始位置信息
        site_init () {
            var jewel_box = document.querySelector('.jewel_box');
            this.jewelLeft = parseInt(jewel_box.offsetLeft)-20;
        }
    }
});