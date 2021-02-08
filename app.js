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
    // 更新小程序版本
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            updateManager.applyUpdate()
          })
          // updateManager.onUpdateFailed(function () {
          //   // 新的版本下载失败
          //   wx.showModal({
          //     title: '已经有新版本了哟~',
          //     content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
          //   })
          // })
        }
      })
    }
  },
  // 全局数据
  globalData: {
    userInfo: null, // 用户信息
    userGameID: null, // 用户游戏ID
    userDiamond: null, // 用户钻石数
    isLogin: null, // 用户是否登录
  }
})