// 游戏介绍界面
const app = getApp();

Page({
  // 初始数据
  data: {
    gameEntranceList: [],
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        gameEntranceList: data.data,
      })
    })
  },
})