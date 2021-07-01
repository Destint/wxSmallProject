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
    let that = this;
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
      title: '发展人、游戏链接入口在这里！赶快收藏呀~',
      path: '/pages/home/home',
      imageUrl: '/images/share_bg.png'
    }
  },
})