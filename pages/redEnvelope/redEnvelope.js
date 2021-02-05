// 红包封面
const app = getApp();

Page({
  data: {
    redEnvelopeData: {}, //红包封面页面数据
    countdown: "", // 视频倒计时
    isClick: false, // 是否可点击领取红包封面
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    var that = this;
    // 获取红包封面数据
    wx.request({
      url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaMedia.GetHongbaoSettings',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          redEnvelopeData: res.data.data
        })
      }
    })
  },
  // 页面显示（每次打开页面都会调用一次）
  onShow: function () {
    this.videoContext = wx.createVideoContext('myVideo') // 获取视频内容
    this.videoContext.seek(0) // 使视频从头播放
  },
  // 视频播放出错回调
  videoErrorCallback: function (e) {
    wx.showToast({
      title: '播放出错，请重进页面',
      icon: 'none',
      duration: 2000
    })
  },
  // 获取视频倒计时
  getCountdown: function (e) {
    var that = this;
    var countdown = parseInt(e.detail.duration - e.detail.currentTime);
    that.setData({
      countdown: countdown,
    })
    if (countdown == 0) {
      that.setData({
        isClick: true,
      })
    }
  },
  // 点击领取红包封面按钮事件
  getRedEnvelope: function () {
    var that = this;
    if (that.data.redEnvelopeData.hongbao_href_open_status != 1) {
      wx.showToast({
        title: '预约成功',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showRedPackage({
        url: that.data.redEnvelopeData.hongbao_href,
        success(res) {
          // 领取成功
        },
        fail(err) {
          wx.showToast({
            title: '封面已领完',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
})