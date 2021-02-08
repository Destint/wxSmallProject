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
})