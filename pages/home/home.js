// 首页
const app = getApp(); // 获取全局变量
const QRCode = require('../../utils/weapp-qrcode.js'); // 引入绘制二维码库
const W = wx.getSystemInfoSync().windowWidth; // 获取窗口宽度
const rate = 750.0 / W; // rpx转为px

Page({
  // 初始数据
  data: {
    showGameInterface: true, // 显示游戏界面
    areaArray: ['奉化地区', '宁波地区', '象山地区', '宁海地区'], // 切换的区域
    currentArea: '奉化地区', // 当前区域
  },

  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    let that = this;
    wx.showShareMenu(); // 开启分享
  },

  // 页面加载（每次都调用）
  onShow: function () {
    let that = this;
    // if (wx.getStorageSync('userGameID') == '') {
    //   app.isLoginReadyCallback = res => {
    //     if (res != '') {}
    //   }
    // }
  },

  // 分享给朋友的页面设置
  onShareAppMessage: function () {
    return {
      title: '发展人、游戏链接入口在这里！赶快收藏呀~',
      path: '/pages/home/home',
      imageUrl: '/images/share_bg.png'
    }
  },

  // 切换区域事件
  switchArer: function () {

  },

  // 生成二维码图片返回路径
  returnPathFromQrcode: function (link, width) {
    let qrcode_w = width / rate; // 160rpx 在6s上为 80px
    new QRCode('qrcode', {
      text: link, // 扫二维码之后跳转的链接
      width: qrcode_w, // 绘制的宽高
      height: qrcode_w,
      colorDark: '#000000',
      colorLight: '#ffffff',
      padding: 2, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度 L M Q H
      callback: res => {
        return res.path;
      }
    });
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