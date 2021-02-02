// 游戏介绍界面
const app = getApp();

Page({
  // 初始数据
  data: {
    gameIntroductionData: {}, // 游戏简介数据
    gameLinkIcon: "/images/gameLink_normal.png", // 游戏链接按钮样式
    DPBLinkIcon: "/images/DPBLink_normal.png", // 发展人链接按钮样式
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        gameIntroductionData: data.data,
      })
    })
  },
  // 开始点击游戏链接按钮事件
  clickGameLinkStart: function () {
    var that = this;
    that.setData({
      gameLinkIcon: "/images/gameLink_highlight.png",
    })
  },
  // 结束点击游戏链接按钮事件
  clickGameLinkEnd: function (e) {
    var that = this;
    that.setData({
      gameLinkIcon: "/images/gameLink_normal.png",
    })
  },
  // 点击游戏链接按钮事件
  clickGameLink: function (e) {
    // var gameLinkType = e.currentTarget.dataset.type; // 获取游戏链接按钮样式
    // var gameLinkContent = e.currentTarget.dataset.content; // 获取游戏链接按钮样式列表
    // if (gameLinkType == 1) {
    //   wx.setClipboardData({
    //     data: gameLinkContent[0].url,
    //     success: function (res) {
    //       wx.hideToast()
    //       wx.showToast({
    //         title: '复制成功，请粘贴到微信后使用',
    //         icon: 'none',
    //         duration: 1500
    //       })
    //     }
    //   })
    // } else if (gameLinkType == 2) {
    //   wx.navigateTo({
    //     url: '/pages/gameStyle/gameStyle',
    //     success: function (res) {
    //       // 通过eventChannel向被打开页面传送数据
    //       res.eventChannel.emit('acceptDataFromOpenerPage', {
    //         data: gameLinkContent
    //       })
    //     }
    //   })
    // }
  },
  // 开始点击发展人链接按钮事件
  clickDPBLinkStart: function () {
    var that = this;
    that.setData({
      DPBLinkIcon: "/images/DPBLink_highlight.png",
    })
  },
  // 结束点击发展人链接按钮事件
  clickDPBLinkEnd: function () {
    var that = this;
    that.setData({
      DPBLinkIcon: "/images/DPBLink_normal.png",
    })
  },
  // 点击发展人链接按钮事件
  clickDPBLink: function (e) {
    // var DPBLinkContent = e.currentTarget.dataset.content; // 获取发展人按钮样式列表
    // wx.setClipboardData({
    //   data: DPBLinkContent[0].url,
    //   success: function (res) {
    //     wx.hideToast()
    //     wx.showToast({
    //       title: '复制成功，请粘贴到微信后使用',
    //       icon: 'none',
    //       duration: 1500
    //     })
    //   }
    // })
  },
})