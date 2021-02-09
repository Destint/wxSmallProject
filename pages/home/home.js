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
        content: [{
            title: "活动时间：",
            content: "2月9日—2月26日",
          }, {
            title: "赠送对象：",
            content: "1、2月9日后首次登录游戏的新用户\n2、1月9日后未登录过的老用户",
          },
          {
            title: "领取方式：",
            content: "在活动期间内，满足以上两种情况的用户登录游戏后系统自动发放"
          }
        ],
      },
      {
        type: "/images/event_icon.png",
        title: "新春福利2：除夕至初四，玩游戏，免费领福袋",
        time: "2021-02-10",
        content: [{
          title: "活动时间：",
          content: "2月11日—2月14日",
        }, {
          title: "活动内容：",
          content: "活动期间，每天13:00、21：00两个时间点，在牌局中的用户可以在游戏界面领取福袋，每个时间段每个ID仅可领取一次，名额有限，抢完为止",
        }],
      },
      {
        type: "/images/event_icon.png",
        title: "新春福利3：新春道具免费送",
        time: "2021-02-10",
        content: [{
          title: "活动时间：",
          content: "2月4日—2月26日",
        }, {
          title: "活动内容：",
          content: "活动期间，玩家首次登录游戏，系统自动赠送新春道具5套，每个ID限送一次",
        }],
      }
    ],
    gameIntroductionList: [], // 游戏简介列表
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    wx.showShareMenu(); // 开启分享
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
    // 获取游戏简介列表
    wx.request({
      url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaMedia.GetGameEntrance',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var arr = res.data.data.list;
        var gameIntroductionList = new Array();
        for (var i in arr) {
          if (arr[i].open_status == 1) {
            gameIntroductionList.push(arr[i])
          }
        }
        // 对象数组按照对象字段降序
        function compare(property) {
          return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
          }
        };
        gameIntroductionList = gameIntroductionList.sort(compare('sort'))
        that.setData({
          gameIntroductionList: gameIntroductionList
        })
      }
    })
  },
  // 分享给朋友的页面设置
  onShareAppMessage: function (res) {
    return {
      title: '新春红包封面免费领！让你的祝福与众不同！',
      path: '/pages/home/home',
      imageUrl: '/images/share_bg.png'
    }
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
  // 点击游戏简介按钮事件
  clickGameIntroduction: function (e) {
    var gameIntroductionData = e.currentTarget.dataset.data; // 获取游戏简介内容
    wx.navigateTo({
      url: '/pages/gameIntroduction/gameIntroduction',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: gameIntroductionData
        })
      }
    })
  },
  // 点击轮播图跳转到其他页面
  goToOtherPage: function (e) {
    wx.switchTab({
      url: `${e.currentTarget.dataset.url}`,
      success: function (res) {}
    })
  },
})