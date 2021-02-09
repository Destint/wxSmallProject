// 活动页面
const app = getApp();

Page({
  // 初始数据
  data: {
    eventAnnouncementData: {}, // 活动公告数据
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    wx.showShareMenu(); // 开启分享
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        eventAnnouncementData: data.data,
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
})