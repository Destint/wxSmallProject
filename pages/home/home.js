// 首页
const app = getApp();

Page({
  // 初始数据
  data: {},

  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    let that = this;
    wx.showShareMenu(); // 开启分享
  },

  // 页面加载（每次都调用）
  onShow: function () {
    let that = this;
    // that.getUserInfo(); // 登录获取用户uid和钻石及地区链接
    // if (wx.getStorageSync('userGameID') == '') {
    //   app.isLoginReadyCallback = res => {
    //     if (res != '') {}
    //   }
    // }
  },

  // 页面隐藏时调用
  onHide: function () {
    let that = this;
    // that.getUserInfo();
  },

  // 分享给朋友的页面设置
  onShareAppMessage: function () {
    return {
      title: '发展人、游戏链接入口在这里！赶快收藏呀~',
      path: '/pages/home/home',
      imageUrl: '/images/share_bg.png'
    }
  },

  // 点击轮播图跳转到其他页面
  goToOtherPage: function (e) {
    wx.switchTab({
      url: `${e.currentTarget.dataset.url}`,
      success: function (res) {}
    })
  },

  // 显示地区及游戏平台号变更
  showAreaAndGamePlatformChanged: function () {
    let that = this;
    let platformArr = [{
        id: 0,
        name: '宁波地区',
        platform: 777,
        baseID: 777
      },
      {
        id: 1,
        name: '象山地区',
        platform: 1172,
        baseID: 999
      },
      {
        id: 2,
        name: '宁海地区',
        platform: 1244,
        baseID: 1244
      },
      {
        id: 3,
        name: '奉化地区',
        platform: 1264,
        baseID: 888
      }
    ]
  },
})