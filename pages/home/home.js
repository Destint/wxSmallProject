// 首页
const app = getApp(); // 获取全局变量
const QRCode = require('../../utils/weapp-qrcode.js'); // 引入绘制二维码库
const W = wx.getSystemInfoSync().windowWidth; // 获取窗口宽度
const rate = 750.0 / W; // rpx转为px

Page({
  // 初始数据
  data: {
    showReferrerInterface: 0, // 显示游戏界面
    areaArray: ['宁波地区', '象山地区', '宁海地区', '奉化地区'], // 切换的区域
    currentArea: '宁波地区', // 当前区域
    gameSharePicture: '../../images/img_game_picture.png', // 游戏分享图片
  },

  platformArr: [], // 不同地区平台列表
  lastPlatform: '', // 上一次登录平台
  baseID: '', // 游戏基础ID
  qrcodePath: '', // 二维码路径

  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    let that = this;
    wx.showShareMenu(); // 开启分享
    if (app.globalData.userID == '') {
      app.isLoginReadyCallback = res => {
        if (res != '') {
          console.log("登录获取ID成功" + app.globalData.userID);
          that.getUserReferrerOrGameInfo(app.globalData.userID);
        }
      }
    } else {
      console.log("缓存获取ID成功" + app.globalData.userID);
      that.getUserReferrerOrGameInfo(app.globalData.userID);
    }
  },

  // 页面加载（每次都调用）
  onShow: function () {
    let that = this;
  },

  // 分享给朋友的页面设置
  onShareAppMessage: function () {
    return {
      title: '发展人、游戏链接入口在这里！赶快收藏呀~',
      path: '/pages/home/home',
      imageUrl: '/images/share_bg.png'
    }
  },

  // 获取用户发展人或游戏信息（是否是发展人和上次登录的链接）
  getUserReferrerOrGameInfo: function (userID, baseID) {
    let that = this;
    baseID = baseID || '';
    wx.request({
      url: 'http://bjtest.bianjiwangluo.cn/h5agency/phpTransfer/mgApi.php?service=App.Referrer_ReferrerInfo.GetPlatformUrlInfo',
      data: {
        user_id: 10998793,
        platform: baseID
      },
      success(res) {
        that.lastPlatform = res.data.data.platform;
        that.baseID = res.data.data.base_id;
        that.setData({
          showReferrerInterface: res.data.data.is_referrer
        })
        that.showAreaAndGamePlatformChanged();
        that.createPathFromQrcode(res.data.data.url, 200);
      }
    })
  },

  // 切换区域事件
  switchArea: function (e) {
    let that = this;
    let userID = app.globalData.userID;
    let baseID = that.platformArr[e.detail.value].platform;
    that.getUserReferrerOrGameInfo(userID, baseID);
  },

  // 生成二维码图片返回路径
  createPathFromQrcode: function (link, width) {
    let that = this;
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
        that.qrcodePath = res.path;
      }
    });
  },

  // 合成二维码和背景图
  drawPictureByQrcodeAndBg: function () {
    let that = this;
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
    ];
    for (var i = 0; i < platformArr.length; i++) {
      if (that.baseID == platformArr[i].baseID) {
        if (that.lastPlatform != platformArr[i].platform) {
          platformArr[i].platform = that.lastPlatform;
        }
        that.platformArr = platformArr;
        that.setData({
          currentArea: platformArr[i].name,
        })
        break;
      }
    }
  },
})