// 招募发展人详情
const app = getApp(); // 获取全局变量

Page({
  // 初始数据
  data: {
    referrerSharePicture: '../../images/img_referrer_picture.png', // 发展人分享图片
  },

  // 获取用户手机号
  getPhoneNumber: function (e) {
    let that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: 'http://nbmjtest.fhabc.com:8001/?s=ApiWxApp.WxaAuth.GetUserPhoneRegisterReferrer',
        data: {
          session_key: app.globalData.userInfo.session_key,
          encrypted_data: e.detail.encryptedData,
          iv: e.detail.iv,
          union_id: app.globalData.userInfo.union_id,
          open_id: app.globalData.userInfo.open_id,
          nick_name: app.globalData.userInfo.name,
          head_img: app.globalData.userInfo.userface,
          sex: app.globalData.userInfo.sexid,
          platform: app.globalData.lastPlatform
        },
        success(res) {
          app.globalData.showReferrerPopup = 1;
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    } else {
      wx.showToast({
        title: '您拒绝了授权',
        icon: 'error',
        duration: 1500
      })
    }
  },
})