// app.js
App({
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch() {
    let that = this;
    that.checkForUpdate();
  },

  // 登录获取用户uid
  getLoginForUserID: function () {
    let that = this;
    wx.login({
      success: function (res_login) {
        if (res_login.code) {
          wx.getUserInfo({
            success: function (res_userInfo) {
              wx.request({
                url: that.globalData.baseUrl1 + 'ApiWxApp.WxaAuth.GetUserInfoByJsCode',
                data: {
                  js_code: res_login.code,
                  encrypted_data: res_userInfo.encryptedData,
                  iv: res_userInfo.iv
                },
                success(res) {
                  that.globalData.userGameID = res.data.data.uid;
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
  },

  // 小程序版本更新检测
  checkForUpdate: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            updateManager.applyUpdate();
          })
        }
      })
    }
  },
  
  // 全局数据
  globalData: {
    baseUrl1: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=', // 基础请求链接1
    baseUrl2: 'https://me.txy78.com/h5agency/phpTransfer/mgApi.php?service=', // 基础请求链接2
    userGameID: '', // 用户游戏id
  }
})