// 招募发展人详情
const app = getApp(); // 获取全局变量

Page({
  // 初始数据
  data:{
    referrerSharePicture: '../../images/img_referrer_picture.png', // 发展人分享图片
  },

  // 立即成为发展人事件
  becomeReferrer: function () {
    let that = this;
    that.setData({
      showReferrerPopup: 1
    })
  },

  // 关闭发展人弹窗事件
  closePopup: function () {
    let that = this;
    that.setData({
      showReferrerPopup: 0
    })
  },
})