// app.js
App({
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch() {
    let that = this;
    that.getLoginForUserID();
    that.checkForUpdate();
  },

  // 当小程序切到后台时执行
  onHide() {},

  // 登录获取用户uid
  getLoginForUserID: function () {
    let that = this;
    wx.login({
      success: function (res_login) {
        if (res_login.code) {
          wx.getUserInfo({
            success: function (res_userInfo) {
              wx.request({
                url: 'http://bjtest.bianjiwangluo.cn/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaAuth.GetUserInfoByJsCode',
                data: {
                  js_code: res_login.code,
                  encrypted_data: res_userInfo.encryptedData,
                  iv: res_userInfo.iv
                },
                success(res) {
                  that.globalData.userInfo = res.data.data;
                  if (that.isLoginReadyCallback) {
                    console.log('登录完成' + res.data.data.uid);
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
    userInfo: '', // 用户信息
    showReferrerPopup: '', // 显示发展人弹窗
    lastPlatform: '', // 用户上一次登录的平台号
  }
})