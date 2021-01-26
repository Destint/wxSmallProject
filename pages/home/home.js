// 首页页面
const app = getApp();

Page({
  // 页面的初始数据
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 判断小程序的API，回调，参数，组件等是否在当前版本可用
    isLogin: false,
    userInfo: {}, // 用户的微信信息
    userGameID: "", // 用户的游戏id
    userDiamond: "", // 用户的钻石数
    payIcon: "../../images/pay_icon_normal.png", // 加号充值按钮
    // 文字广播列表
    noticeList: [{
      content: "奉化六扣上线啦！"
    }],
    // 轮播图列表
    advertisementList: [],
    // 游戏入口列表
    // gameEntranceList: [],
    // gameLinkIconNormal: "/images/gameLink_normal.png",
    // downloadLinkIconNormal: "/images/download_normal.png",
    // gameLinkIconHigh: "/images/gameLink_high.png",
    // downloadLinkIconHigh: "/images/download_high.png",
    // DPBIconNormal: "/images/DPB_normal.png",
    // DPBIconHigh: "/images/DPB_high.png",
    // clickIndex: "-1", //点击游戏链接按钮标识
    // clickIndex1: "-1", //点击发展人按钮标识
    // clickIndex2: "-1", //点击登录按钮标识
    activityNoticeList: [{
        title: "专属定制红包封面，让你与众不同"
      },
      {
        title: "新春福利1：新注册用户及老用户回归免费送钻",
        time: "活动时间：2月9日-2月26日",
        content: "赠送对象:\n1、2月9日后首次登陆游戏的新用户\n2、1月9日后未游戏过的老用户\n领取方式：在活动期间内，满足以上两种情况的用户\n登陆游戏后系统自动发放"
      },
      {
        title: "新春福利2：除夕至初四，玩游戏，免费领福袋",
        time: "活动时间：除夕、初一、初二、初三",
        content: "活动期间，每天13:00、21：00两个时间点，在牌局中的用户可以在游戏界面领取福袋，每个时间段每个ID仅可领取一次，名额有限，抢完为止"
      },
      {
        title: "新春福利3：新春道具免费送",
        time: "活动时间：2月4日8:00",
        content: "在活动开始后，玩家首次登陆游戏，系统自动赠送新春道具5套，每个ID限送一次"
      }
    ],
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
        // console.log(res.data.data)
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
        // console.log(res.data.data)
        that.setData({
          advertisementList: res.data.data.list
        })
      }
    })

    // 获取游戏入口
    // wx.request({
    //   url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaMedia.GetGameEntrance',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     // console.log(res.data.data)
    //     that.setData({
    //       gameEntranceList: res.data.data.list
    //     })
    //   }
    // })
  },

  // 授权登录按钮事件
  clickLoginBtn: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      // 用户按了授权登录按钮
      // 获取到用户的信息
      app.globalData.userInfo = e.detail.userInfo;
      // 获取用户登录数据
      wx.login({
        success: function (res_login) {
          if (res_login.code) {
            wx.getUserInfo({
              success: function (res) {
                app.globalData.userInfo = res.userInfo;
                wx.request({
                  url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaAuth.GetUserInfoByJsCode',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  data: {
                    js_code: res_login.code,
                    encrypted_data: res.encryptedData,
                    iv: res.iv
                  },
                  success(res) {
                    // console.log(res.data)
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
      // 用户按了拒绝授权 弹出警告
      wx.showModal({
        title: '无法登陆完成',
        content: '为了获取您的游戏信息，请先进行授权哦',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            // 用户点了返回授权
            // console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  // 开始触摸加号充值按钮事件
  // clickPayStart: function () {
  //   var that = this;
  //   that.setData({
  //     payIcon: "../../images/pay_icon_high.png"
  //   })
  // },

  // 结束触摸加号充值按钮事件
  // clickPayEnd: function () {
  //   var that = this;
  //   that.setData({
  //     payIcon: "../../images/pay_icon_normal.png"
  //   })
  // },

  // 触摸加号充值按钮后触发事件
  // clickPayTap: function () {
  //   var that = this;
  //   wx.showModal({
  //     title: '暂无内容',
  //     content: '更多功能正在开发中，敬请期待',
  //     showCancel: false,
  //     confirmText: '返回',
  //     success: function (res) {
  //       if (res.confirm) {
  //         that.setData({
  //           payIcon: "../../images/pay_icon_normal.png"
  //         })
  //         // console.log("用户点击了充值返回")
  //       }
  //     }
  //   });
  // },

  // 开始触摸游戏链接按钮事件
  // clickGameLinkStart: function (e) {
  //   var id = e.currentTarget.dataset.id; // 获取游戏链接按钮id
  //   var that = this;
  //   that.setData({
  //     clickIndex: id,
  //   })
  // },

  // 结束触摸游戏链接按钮事件
  // clickGameLinkEnd: function (e) {
  //   var that = this;
  //   that.setData({
  //     clickIndex: "-1",
  //   })
  // },

  // 点击游戏链接按钮事件
  // clickGameLinkTap: function (e) {
  //   var gameLinkType = e.currentTarget.dataset.type; // 获取游戏链接按钮样式
  //   var gameLinkContent = e.currentTarget.dataset.content; // 获取游戏链接按钮样式列表
  //   if (gameLinkType == 1) {
  //     wx.setClipboardData({
  //       data: gameLinkContent[0].url,
  //       success: function (res) {
  //         wx.hideToast()
  //         wx.showToast({
  //           title: '复制成功，请粘贴到微信后使用',
  //           icon: 'none',
  //           duration: 1500
  //         })
  //       }
  //     })
  //   } else if (gameLinkType == 2) {
  //     wx.navigateTo({
  //       url: '/pages/gameStyle/gameStyle',
  //       success: function (res) {
  //         // 通过eventChannel向被打开页面传送数据
  //         res.eventChannel.emit('acceptDataFromOpenerPage', {
  //           data: gameLinkContent
  //         })
  //       }
  //     })
  //   }
  // },

  // 开始触摸发展人按钮事件
  // clickDPBLinkStart: function (e) {
  //   var id = e.currentTarget.dataset.id; // 获取发展人按钮id
  //   var that = this;
  //   that.setData({
  //     clickIndex1: id,
  //   })
  // },

  // 结束触摸发展人按钮事件
  // clickDPBLinkEnd: function () {
  //   var that = this;
  //   that.setData({
  //     clickIndex1: "-1",
  //   })
  // },

  // 点击发展人按钮事件
  // clickDPBLinkTap: function (e) {
  //   var DPBLinkContent = e.currentTarget.dataset.content; // 获取发展人按钮样式列表
  //   wx.setClipboardData({
  //     data: DPBLinkContent[0].url,
  //     success: function (res) {
  //       wx.hideToast()
  //       wx.showToast({
  //         title: '复制成功，请粘贴到微信后使用',
  //         icon: 'none',
  //         duration: 1500
  //       })
  //     }
  //   })
  // }
  clickActivity: function (e) {
    var data = e.currentTarget.dataset.data; // 获取活动内容
    wx.navigateTo({
      url: '/pages/activity/activity',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: data
        })
      }
    })
  },

  clickGameList:function(){
    wx.navigateTo({
      url: '/pages/introduced/introduced',
    })
  }
})