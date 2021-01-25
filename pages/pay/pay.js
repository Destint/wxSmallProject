// 充值页面
const app = getApp();

Page({
  // 页面的初始数据
  // data: {
  //   userInfo: {},
  //   userGameID: 10000021,
  //   userDiamond: 10000000,
  //   payCategoryList: [{
  //       "diamondNum": "100",
  //       "originalPrice": "10",
  //       "presentPrice": "9.9"
  //     },
  //     {
  //       "diamondNum": "1000",
  //       "originalPrice": "19.9",
  //       "presentPrice": "19.9"
  //     },
  //     {
  //       "diamondNum": "3000",
  //       "originalPrice": "29.9",
  //       "presentPrice": "29.9"
  //     },
  //     {
  //       "diamondNum": "100",
  //       "originalPrice": "10",
  //       "presentPrice": "9.9"
  //     },
  //     {
  //       "diamondNum": "1000",
  //       "originalPrice": "19.9",
  //       "presentPrice": "19.9"
  //     },
  //     {
  //       "diamondNum": "3000",
  //       "originalPrice": "29.9",
  //       "presentPrice": "29.9"
  //     }
  //   ]
  // },
  // 页面加载（一个页面只会调用一次）
  // onLoad: function () {
  //   var that = this;
  //   wx.getUserInfo({
  //     success: function (res) {
  //       that.setData({
  //         userInfo: res.userInfo
  //       })
  //     }
  //   })
  //   // that.setData({
  //   //   userInfo:app.globalData.userInfo
  //   // })
  // },
  // 页面显示（每次打开页面都会调用一次）
  onShow: function () {
    //用户按了拒绝按钮
    wx.showModal({
      title: '暂无内容',
      content: '更多功能正在开发中，敬请期待',
      showCancel: false,
      confirmText: '返回首页',
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/home/home'
          })
        }
      }
    });
  },
})