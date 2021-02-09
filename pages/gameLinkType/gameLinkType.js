// 游戏链接类型
const app = getApp();

Page({
  // 页面的初始数据
  data: {
    gameLinkTypeList: [], // 游戏链接类型列表
    clickIndex: "-1" // 复制链接按钮标识
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    wx.showShareMenu(); // 开启分享
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        gameLinkTypeList: data.data,
      })
    })
  },
  // 分享给朋友的页面设置
  onShareAppMessage: function (res) {
    return {
      title: '新春红包封面免费领！让你的祝福与众不同！',
      path: '/pages/home/home',
      imageUrl: '/images/share_bg.png'
    }
  },
  // 开始点击复制链接按钮事件
  clickCopyLinkStart: function (e) {
    var id = e.currentTarget.dataset.id; // 获取复制链接按钮id
    var that = this;
    that.setData({
      clickIndex: id,
    })
  },
  // 结束点击复制链接按钮事件
  clickCopyLinkEnd: function () {
    var that = this;
    that.setData({
      clickIndex: "-1",
    })
  },
  //点击复制链接按钮事件
  clickCopyLinkTap: function (e) {
    var content = e.currentTarget.dataset.content; // 获取复制链接按钮内容
    var id = e.currentTarget.dataset.id; // 获取复制链接按钮id
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.hideToast()
        if (id == 0) {
          wx.showToast({
            title: '复制成功，请粘贴到微信后使用',
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '复制成功，请粘贴发送给好友',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  }
})