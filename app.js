// app.js
App({
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch() {
    let that = this;
    that.checkForUpdate();
    that.checkForIDByStorage();
  },

  // 当小程序切到后台时执行
  onHide() {
    let that = this;
    that.globalData.enterFromBackstage = 1;
  },

  // 检测本地缓存中有无用户uid
  checkForIDByStorage: function () {
    let that = this;
    let userGameID = wx.getStorageSync('userGameID');
    if (userGameID == '') {
      that.getLoginForUserID();
    }
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
                  wx.setStorageSync('userGameID', res.data.data.uid);
                  if (that.isLoginReadyCallback) {
                    console.log('登录完成');
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
    enterFromBackstage: 1,
  }
})