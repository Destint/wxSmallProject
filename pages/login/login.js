// 登录页面
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 判断小程序的API，回调，参数，组件等是否在当前版本可用
    isHide: false // 是否显示登录页面
  },

  onLoad: function () {
    var that = this;
    if (that.data.canIUse == true) {
      // 查看用户是否授权登录信息
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 用户已授权登录信息
            wx.login({
              success: function (res_login) {
                if (res_login.code) {
                  wx.getUserInfo({
                    success: function (res) {
                      app.globalData.userInfo = res.userInfo;
                      wx.request({
                        url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaAuth.GetUserInfoByJsCode',
                        header: {
                          'Content-Type': 'application/json'
                        },
                        data: {
                          js_code: res_login.code,
                          encrypted_data: res.encryptedData,
                          iv: res.iv
                        },
                        success(res) {
                          // console.log(res.data)
                          app.globalData.userGameID = res.data.data.uid
                          app.globalData.userDiamond = res.data.data.money
                          wx.switchTab({
                            url: '/pages/home/home'
                          })
                        }
                      })
                    }
                  })
                }
              }
            })
          } else {
            // 用户没有授权
            // 改变 isHide 的值，显示授权登录页面
            that.setData({
              isHide: true
            });
          }
        }
      });
    } else {
      // 用户微信版本过低提示
      wx.showModal({
        title: '无法登陆完成',
        content: '微信版本过低，请升级微信',
        showCancel: false,
        confirmText: '确认',
      });
    }
  },

  // 授权登录按钮事件
  clickLoginBtn: function (e) {
    if (e.detail.userInfo) {
      // 用户按了授权登录按钮
      // 获取到用户的信息
      app.globalData.userInfo = e.detail.userInfo;
      // 获取用户登录数据
      wx.login({
        success: function (res_login) {
          if (res_login.code) {
            wx.getUserInfo({
              success: function (res) {
                app.globalData.userInfo = res.userInfo;
                wx.request({
                  url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaAuth.GetUserInfoByJsCode',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  data: {
                    js_code: res_login.code,
                    encrypted_data: res.encryptedData,
                    iv: res.iv
                  },
                  success(res) {
                    // console.log(res.data)
                    app.globalData.userGameID = res.data.data.uid
                    app.globalData.userDiamond = res.data.data.money
                    wx.switchTab({
                      url: '/pages/home/home'
                    })
                  }
                })
              }
            })
          }
        }
      })
    } else {
      // 用户按了拒绝授权 弹出警告
      wx.showModal({
        title: '无法登陆完成',
        content: '为了获取您的游戏信息，请先进行授权哦',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            // 用户点了返回授权
            // console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})