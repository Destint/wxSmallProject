// 首页
const app = getApp();

Page({
  // 初始数据
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 判断小程序的API，回调，参数，组件等是否在当前版本可用
    isLogin: false, // 用户是否登录
    userInfo: {}, // 用户微信信息
    userGameID: "", // 用户游戏id
    userDiamond: "", // 用户钻石数
    noticeList: [], // 文字广播列表
    bannerList: [], // 轮播图列表
    // 活动公告列表
    eventAnnouncementList: [{
        type: "/images/event_icon.png",
        title: "新春福利1：新注册用户及老用户回归免费送钻",
        time: "2021-02-10",
        content: "赠送对象:\n1、2月9日后首次登陆游戏的新用户\n2、1月9日后未游戏过的老用户\n领取方式：在活动期间内，满足以上两种情况的用户\n登陆游戏后系统自动发放"
      },
      {
        type: "/images/event_icon.png",
        title: "新春福利2：除夕至初四，玩游戏，免费领福袋",
        time: "2021-02-10",
        content: "活动期间，每天13:00、21：00两个时间点，在牌局中的用户可以在游戏界面领取福袋，每个时间段每个ID仅可领取一次，名额有限，抢完为止"
      },
      {
        type: "/images/announcement_icon.png",
        title: "新春福利3：新春道具免费送",
        time: "2021-02-10",
        content: "在活动开始后，玩家首次登陆游戏，系统自动赠送新春道具5套，每个ID限送一次"
      }
    ],
    // 游戏简介列表
    gameIntroductionList: [{
      icon: "/images/gameIcon_1.png",
      title: "同乡游麻将",
      feature: "专为约局打造的俱乐部功能组局更方便",
      play: "宁波麻将、北仑麻将、慈溪麻将、余姚麻将、推倒胡、关牌的多款游戏不同玩法",
      detailedFeature: "        同乡游麻将专注宁波地区本土棋牌游戏，玩法齐全，规则多样，专注好友约局，俱乐部功能火热上线，私人定制俱乐部玩法，成员审核加入，管理更方便",
      detailedPlay: "       包含的游戏有：宁波麻将、北仑麻将、慈溪麻将、余姚麻将、推倒胡、关牌",
    }],
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    var that = this;
    // 判断app.js onLaunch是否执行完毕
    if (app.globalData.isLogin) {
      that.setData({
        userInfo: app.globalData.userInfo,
        userGameID: app.globalData.userGameID,
        userDiamond: app.globalData.userDiamond,
        isLogin: app.globalData.isLogin,
      })
    } else {
      app.isLoginReadyCallback = res => {
        that.setData({
          userInfo: app.globalData.userInfo,
          userGameID: app.globalData.userGameID,
          userDiamond: app.globalData.userDiamond,
          isLogin: app.globalData.isLogin,
        })
      };
    }
    // 获取文字广播
    wx.request({
      url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaMedia.GetNotices',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          noticeList: res.data.data.list
        })
      }
    })
    // 获取轮播图
    wx.request({
      url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaMedia.GetBanners',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          bannerList: res.data.data.list
        })
      }
    })
  },
  // 点击登录按钮事件
  clickLoginBtn: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      // 用户成功授权登录
      app.globalData.userInfo = e.detail.userInfo; // 获取用户的信息
      wx.login({
        // 获取用户游戏ID和钻石
        success: function (res_login) {
          if (res_login.code) {
            wx.getUserInfo({
              success: function (res) {
                wx.request({
                  url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaAuth.GetUserInfoByJsCode', // 请求地址
                  header: {
                    'Content-Type': 'application/json' // 默认值
                  },
                  // 发送给后台的数据
                  data: {
                    js_code: res_login.code,
                    encrypted_data: res.encryptedData,
                    iv: res.iv
                  },
                  success(res) {
                    app.globalData.userGameID = res.data.data.uid
                    app.globalData.userDiamond = res.data.data.money
                    app.globalData.isLogin = true
                    that.setData({
                      userInfo: app.globalData.userInfo,
                      userGameID: app.globalData.userGameID,
                      userDiamond: app.globalData.userDiamond,
                      isLogin: app.globalData.isLogin,
                    })
                  }
                })
              }
            })
          }
        }
      })
    } else {
      // 用户拒绝了授权 弹出警告
      wx.showModal({
        title: '无法登陆完成',
        content: '为了获取您的游戏信息，请先进行授权哦',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            // 用户点了返回授权
          }
        }
      });
    }
  },
  // 点击更多按钮事件
  clickMore: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/moreEventAnnouncement/moreEventAnnouncement',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: that.data.eventAnnouncementList
        })
      }
    })
  },
  // 点击活动公告按钮事件
  clickEventAnnouncement: function (e) {
    var eventAnnouncementData = e.currentTarget.dataset.data; // 获取活动公告内容
    wx.navigateTo({
      url: '/pages/eventAnnouncement/eventAnnouncement',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: eventAnnouncementData
        })
      }
    })
  },
})