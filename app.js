// app.js
App({
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch() {
    let that = this;
    that.checkForUpdate();
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
  }
})