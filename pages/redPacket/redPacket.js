// 红包封面页面
const app = getApp();

Page({
  data: {
    countdown: 30,
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:' + e.detail.errMsg);
  },
  getCountdown: function(e){
    var that = this;
    console.log(e.detail)
    var time = parseInt(e.detail.duration - e.detail.currentTime);
    that.setData({
      countdown: time,
    })
  }
})