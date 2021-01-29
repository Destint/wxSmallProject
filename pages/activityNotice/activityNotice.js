// 活动页面
const app = getApp();

Page({
  // 初始数据
  data: {
    activityNoticeList: {
      title: "新春福利1：新注册用户及老用户回归免费送钻",
      time: "活动时间：2月9日-2月26日",
      content: "赠送对象:1、2月9日后首次登陆游戏的新用户\n2、1月9日后未游戏过的老用户\n领取方式：在活动期间内，满足以上两种情况的用户登陆游戏后系统自动发放"
    },
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      // console.log(data.data)
      that.setData({
        activityNoticeList: data.data,
      })
    })
  },
})