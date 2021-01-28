// app.js
App({
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch() {
    var that = this;
    wx.getSetting({
      // 判断用户是否授权登录
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 用户已授权登录信息
          wx.login({
            // 获取用户游戏id和钻石
            success: function (res_login) {
              if (res_login.code) {
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo;
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
                        that.globalData.userGameID = res.data.data.uid
                        that.globalData.userDiamond = res.data.data.money
                        that.globalData.isLogin = true
                        if (that.isLoginReadyCallback) {
                          that.isLoginReadyCallback(res);
                        }
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    });
  },

  // 全局数据
  globalData: {
    userInfo: null,
    userGameID: null,
    userDiamond: null,
    isLogin: null,
  }
})