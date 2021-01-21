// 首页页面
const app = getApp();

Page({
  // 页面的初始数据
  data: {
    userInfo: {}, // 用户的微信信息
    userGameID: "", // 用户的游戏id
    userDiamond: "", // 用户的钻石数
    payIcon: "../../images/pay_icon_normal.png", // 加号充值按钮
    // index: 0,
    // 文字广播列表
    noticeList: [{
      content: "奉化六扣上线啦！"
    }],
    // 轮播图列表
    advertisementList: [],
    // 游戏入口列表
    gameEntranceList: [],
    gameLinkIconNormal: "/images/gameLink_normal.png",
    downloadLinkIconNormal: "/images/download_normal.png",
    gameLinkIconHigh: "/images/gameLink_high.png",
    downloadLinkIconHigh: "/images/download_high.png",
    DPBIconNormal: "/images/DPB_normal.png",
    DPBIconHigh: "/images/DPB_high.png",
    clickIndex: "-1", //点击游戏链接按钮标识
    clickIndex1: "-1" //点击发展人按钮标识
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    var that = this;
    // 用户信息
    that.setData({
      userInfo: app.globalData.userInfo,
      userGameID: app.globalData.userGameID,
      userDiamond: app.globalData.userDiamond
    })

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
      }),

      // 获取游戏入口
      wx.request({
        url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaMedia.GetGameEntrance',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data.data)
          that.setData({
            gameEntranceList: res.data.data.list
          })
        }
      })
  },

  // 开始触摸加号充值按钮事件
  clickPayStart: function () {
    var that = this;
    that.setData({
      payIcon: "../../images/pay_icon_high.png"
    })
  },

  // 结束触摸加号充值按钮事件
  clickPayEnd: function () {
    var that = this;
    that.setData({
      payIcon: "../../images/pay_icon_normal.png"
    })
  },

  // 触摸加号充值按钮后触发事件
  clickPayTap: function () {
    var that = this;
    wx.showModal({
      title: '暂无内容',
      content: '更多功能正在开发中，敬请期待',
      showCancel: false,
      confirmText: '返回',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            payIcon: "../../images/pay_icon_normal.png"
          })
          // console.log("用户点击了充值返回")
        }
      }
    });
  },

  // 开始触摸游戏链接按钮事件
  clickGameLinkStart: function (e) {
    var id = e.currentTarget.dataset.id; // 获取游戏链接按钮id
    var that = this;
    that.setData({
      clickIndex: id,
    })
  },

  // 结束触摸游戏链接按钮事件
  clickGameLinkEnd: function (e) {
    var that = this;
    that.setData({
      clickIndex: "-1",
    })
  },

  // 点击游戏链接按钮事件
  clickGameLinkTap: function (e) {
    var gameLinkType = e.currentTarget.dataset.type; // 获取游戏链接按钮样式
    var gameLinkContent = e.currentTarget.dataset.content; // 获取游戏链接按钮样式列表
    if (gameLinkType == 1) {
      wx.setClipboardData({
        data: gameLinkContent[0].url,
        success: function (res) {}
      })
    } else if (gameLinkType == 2) {
      wx.navigateTo({
        url: '/pages/gameStyle/gameStyle',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            data: gameLinkContent
          })
        }
      })
    }
  },

  // 开始触摸发展人按钮事件
  clickDPBLinkStart: function (e) {
    var id = e.currentTarget.dataset.id; // 获取发展人按钮id
    var that = this;
    that.setData({
      clickIndex1: id,
    })
  },

  // 结束触摸发展人按钮事件
  clickDPBLinkEnd: function () {
    var that = this;
    that.setData({
      clickIndex1: "-1",
    })
  },

  // 点击发展人按钮事件
  clickDPBLinkTap: function (e) {
    var DPBLinkContent = e.currentTarget.dataset.content; // 获取发展人按钮样式列表
    wx.setClipboardData({
      data: DPBLinkContent[0].url,
      success: function (res) {}
    })
  }
})