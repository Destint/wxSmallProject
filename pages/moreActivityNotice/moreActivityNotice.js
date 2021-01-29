// 更多活动公告
const app = getApp();

Page({
  // 初始数据
  data: {
    activityNoticeList: [],
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        activityNoticeList: data.data,
      })
    })
  },
  // 点击活动公告按钮事件
  clickActivityNotice: function (e) {
    var data = e.currentTarget.dataset.data; // 获取活动公告内容
    wx.navigateTo({
      url: '/pages/activityNotice/activityNotice',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: data
        })
      }
    })
  },
})