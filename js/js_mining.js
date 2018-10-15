function Game() {
    this.leftPosition = [];
    this.topPosition = [];
    this.bgWith='';
    this.isLogin='';
    this.jewelAllNum='';
    this.allTime='7200';
    this.initData={
        userName:'陌上少年着白衣',
		userImg:'../img/userPhoto.jpg',
		jewelNum:'0.22222',
		powerNum:'0.2'
    };
    //公告
    this.noticeCon='世界上除了相互喜欢 其他的喜欢都是伤害 愿余下岁月燃梦祝歌 愿所有伤痛焚诗祭酒';
    this.jewelData=[
        {diamondNum:'0.12314',id:'1'},
        {diamondNum:'0.13142',id:'2'},
        {diamondNum:'0.12323',id:'3'},
        {diamondNum:'0.12323',id:'4'},
        {diamondNum:'0.12323',id:'5'},
        {diamondNum:'0.12323',id:'6'},
        {diamondNum:'0.12323',id:'7'},
        {diamondNum:'0.12615',id:'8'}
    ]
}
Game.prototype = {
    //开始挖矿
    start: function () {
        this.getJewel();
        this.click();
        this.init();
        this.page_turns();
    },
	init () {
        // if(this.isLogin == '1') {
        //
		// }else{
        //
		// }
        this.jewelAllNum = this.jewelData.length;
    	let author=document.querySelector('.author');
        author.children[0].src = this.initData.userImg;
        author.children[1].innerHTML = this.initData.userName;
        document.querySelector('.jewel_num').innerHTML = this.initData.jewelNum;
        document.querySelector('.power_num').innerHTML = this.initData.powerNum;
    	document.querySelector('marquee').innerHTML = this.noticeCon;
	},
    // 钻石位置去重
    checkPosition (lefts, tops) {
        for(let i = 0; i < this.topPosition.length; i++) {
            if(Math.abs(this.topPosition[i] - tops) < 100 && Math.abs(this.leftPosition[i] - lefts) < 45) {
                return true;
            }
        }
    },
    // 产生每一个钻石
    getJewel () {
        for(let i=0;i<this.jewelData.length;i++){
            let minBack = document.querySelector('.minBox');
            let lefts, tops;
            let jewel = document.createElement('div');
            // 钻石位置去重
            do {
                lefts = (minBack.offsetWidth - 80) * Math.random() + 25;
                tops = (minBack.offsetHeight - 250) * Math.random() + 60;
            } while (this.checkPosition(lefts, tops));

            jewel.classList.add('jewel');
            jewel.setAttribute('listId', this.jewelData[i].id);
            jewel.innerHTML = `
									 <div></div>
									 <span>${this.jewelData[i].diamondNum}</span>
								`;
            jewel.style.cssText = `
							   left:${lefts}px;
							   top:${tops}px;
							`;
            minBack.appendChild(jewel);
            this.leftPosition.push(lefts);
            this.topPosition.push(tops);
        }
    },
    // 点击收取钻石
    click () {
    	let _this=this;
        let minBox = document.querySelector('.minBox');
        mui('.minBox').on('tap', '.jewel', function() {
            let jewel_num = document.querySelector('.jewel_num');
            let total = parseFloat(jewel_num.innerHTML);
            let count = parseFloat(this.children[1].innerHTML);
            // document.querySelector('audio').play();
            total = total + count;
            jewel_num.innerHTML = total.toFixed(5);
            $(this).animate({
                right: "0.1rem",
                top: '0.1rem',
                width: '0',
                height: '0',
                fontSize: '0'
            }, 'slow', 'linear', function() {
                minBox.removeChild(this);
                _this.jewelAllNum = parseInt(_this.jewelAllNum)-1;
                console.log(_this.jewelAllNum)
                if(_this.jewelAllNum == '0'){
                    _this.mine('5600');
				}
            })
        })
    },
    login () {
        let minBox = document.querySelector('.minBox');
        let login_jewel = document.createElement('div');
        login_jewel.innerHTML = `
						<div class="login_jewel page_turns" name="login">
							<img src="../img/icon_kuang%20copy@2x.png" alt="">
							<span>开启登录</span>
						</div>
								`;
        login_jewel.classList.add('login_jewel');
        minBox.appendChild(login_jewel);
	},
    // 开采中，倒计时
    mine (param) {
        let minBox = document.querySelector('.minBox');
        let mine = document.createElement('div');
        mine.innerHTML = `
								<img src="../img/icon_kuang%20copy@2x.png" alt="">
								<div class="time">
									<div></div>
									<span>${this.timeInit(param)}</span>
								</div>
								<span>挖矿中</span>
								`;
        mine.classList.add('mine');
        minBox.appendChild(mine);
        document.querySelector(".time").children[0].style.width = this.bgWith;
        this.time(param);
    },
    //  开采倒计时
    time (param) {
        let that = this;
        let totalTime = parseInt(param);
        let t1 = setInterval(function() {
            totalTime -= 1;
            that.bgWith = totalTime/parseInt(that.allTime)*100+'%';
            let hour = '0' + Math.floor(totalTime / (60 * 60)) + ':';
            param = totalTime % (60 * 60);
            let minute = Math.floor(param / 60) < 10 ? '0' + Math.floor(param / 60) : Math.floor(param / 60);
            param = totalTime % 60;
            let second = param < 10 ? '0' + param : param;
            document.querySelector('.time').children[1].innerHTML = hour + minute + ':' + second;
            document.querySelector(".time").children[0].style.width = that.bgWith;
            if(totalTime == '0') {
                clearInterval(t1);
                let parent = document.querySelector(".minBox");
                let child = document.querySelector(".mine");
                parent.removeChild(child);
                that.getJewels();
            }

        }, 1000)
    },
    //初始化状态
    timeInit (param) {
        let totalTime = parseInt(param);
        this.bgWith = totalTime/parseInt(this.allTime)*100+'%';
        let hour = '0' + Math.floor(totalTime / (60 * 60)) + ':';
        param = totalTime % (60 * 60);
        let minute = Math.floor(param / 60) < 10 ? '0' + Math.floor(param / 60) : Math.floor(param / 60);
        param = totalTime % 60;
        let second = param < 10 ? '0' + param : param;
        return hour + minute + ':' + second;
    },
    page_turns () {
        mui('.addBox').on('tap', '.page_turns', function() {
        	let name = this.getAttribute('name')
			alert(name)
		})
        // window.JanesiBridge.callNative('open',{page: params});
    }
};