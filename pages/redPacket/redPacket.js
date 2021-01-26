// 红包封面页面
const app = getApp();

Page({
  data: {
    countdown: "",
    isClick: false,
  },
  onShow: function () {
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.seek(0)
  },
  videoErrorCallback: function (e) {
    // console.log('视频错误信息:' + e.detail.errMsg);
  },
  getCountdown: function (e) {
    var that = this;
    var time = parseInt(e.detail.duration - e.detail.currentTime);
    that.setData({
      countdown: time,
    })
    if (time == 0) {
      that.setData({
        isClick: true,
      })
    }
  },
  getRedPacket: function () {
    wx.showToast({
      title: '预约成功',
      icon: 'none',
      duration: 2000
    })
  }
})