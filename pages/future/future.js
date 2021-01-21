// 敬请期待页面
const app = getApp();

Page({
  // 页面的初始数据
  // data: {},
  // 页面加载（一个页面只会调用一次）
  // onLoad: function () {},
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