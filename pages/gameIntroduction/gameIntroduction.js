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
    wx.showShareMenu(); // 开启分享
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        gameIntroductionData: data.data,
      })
      wx.setNavigationBarTitle({
        title: data.data.title
      })
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
  clickGameLink: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/gameLinkType/gameLinkType',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: that.data.gameIntroductionData.button_1
        })
      }
    })
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
  clickDPBLink: function () {
    var that = this;
    wx.setClipboardData({
      data: that.data.gameIntroductionData.button_2[0].url,
      success: function (res) {
        wx.hideToast()
        wx.showToast({
          title: '复制成功，请粘贴到微信后使用',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
})