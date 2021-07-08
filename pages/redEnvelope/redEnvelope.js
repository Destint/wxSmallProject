// 红包封面
const app = getApp();

Page({
  data: {
    redEnvelopeData: wx.getStorageSync('redEnvelopeData'), //红包封面页面数据
    countdown: "", // 视频倒计时
    isClick: false, // 是否可点击领取红包封面
    getRedEnvelopeType: '看完视频领取封面', // 领取红包按钮状态
  },

  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    let that = this;
    wx.showShareMenu(); // 开启分享
    that.getRedEnvelopeData(); // 获取红包封面数据
  },

  // 页面显示（每次打开页面都会调用一次）
  onShow: function () {
    this.videoContext = wx.createVideoContext('myVideo'); // 获取视频内容
    this.videoContext.seek(0); // 使视频从头播放
  },

  // 获取红包封面数据
  getRedEnvelopeData: function () {
    let that = this;
    let tip = '';
    let redEnvelopeData = wx.getStorageSync('redEnvelopeData');
    wx.request({
      url: app.globalData.baseUrl1 + 'ApiWxApp.WxaMedia.GetHongbaoSettings',
      success(res) {
        if (redEnvelopeData == '' || JSON.stringify(redEnvelopeData) != JSON.stringify(res.data.data)) {
          if (res.data.data.hongbao_href_open_status != 3) {
            if (res.data.data.hongbao_href_open_status == 1) {
              tip = '看完视频领取封面';
            } else {
              tip = '预约红包封面';
            }
          }
          that.setData({
            redEnvelopeData: res.data.data,
            getRedEnvelopeType: tip
          })
          wx.setStorageSync('redEnvelopeData', res.data.data);
        } else {
          if (res.data.data.hongbao_href_open_status != 3) {
            if (res.data.data.hongbao_href_open_status != 1) {
              that.setData({
                getRedEnvelopeType: '预约红包封面'
              })
            }
          }
        }
      }
    })
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
    let that = this;
    let countdown = parseInt(e.detail.duration - e.detail.currentTime);
    if (countdown == 0) {
      that.setData({
        isClick: true,
        getRedEnvelopeType: '领取红包封面',
        countdown: countdown
      })
    } else {
      that.setData({
        countdown: countdown
      })
    }
  },

  // 点击领取红包封面按钮事件
  getRedEnvelope: function () {
    let that = this;
    if (that.data.redEnvelopeData.hongbao_href_open_status != 1) {
      wx.showToast({
        title: '预约成功',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (wx.canIUse('showRedPackage')) {
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
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
          showCancel: false,
          confirmText: '确定',
        })
      }
    }
  },

  // 分享给朋友的页面设置
  onShareAppMessage: function () {
    return {
      title: '发展人、游戏链接入口在这里！赶快收藏呀~',
      path: '/pages/home/home',
      imageUrl: '/images/share_bg.png'
    }
  },
})