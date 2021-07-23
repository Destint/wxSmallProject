// 首页
import drawQrcode from '../../utils/weapp.qrcode.esm.js'; // 引入绘制二维码库
const app = getApp(); // 获取全局变量
const W = wx.getSystemInfoSync().windowWidth; // 获取窗口宽度
const rate = 750.0 / W; // rpx转为px

Page({
  // 初始数据
  data: {
    showReferrerInterface: wx.getStorageSync('isReferrer'), // 显示发展人界面
    areaArray: ['宁波地区', '象山地区', '宁海地区', '奉化地区'], // 切换的区域
    currentArea: '', // 当前区域
    gameSharePicture: '../../images/img_game_picture.png', // 游戏分享图片
    referrerSharePicture: '../../images/img_referrer_picture.png', // 发展人分享图片
    qrcode_w: '', // 二维码的宽高
    sharePic_w: '', // 分享的图片的宽
    sharePic_h: '', // 分享的图片的高
    showReferrerPopup: '', // 显示注册发展人成功弹窗
  },

  platformArr: [], // 不同地区平台列表
  baseID: '', // 游戏基础ID
  becomeReferrer: '', // 成为发展人成功

  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    wx.showShareMenu(); // 开启分享
  },

  // 页面加载（每次都会调用）
  onShow: function () {
    let that = this;
    let userID = wx.getStorageSync('userID');
    let isReferrer = wx.getStorageSync('isReferrer');
    if (userID && isReferrer) {
      console.log('缓存登录' + userID)
      that.getUserReferrerOrGameInfo(userID);
    } else {
      if (app.globalData.userInfo.uid == '') {
        app.isLoginReadyCallback = res => {
          if (res) {
            console.log('延迟登录' + app.globalData.userInfo.uid)
            that.getUserReferrerOrGameInfo(app.globalData.userInfo.uid);
          }
        }
      } else {
        console.log('直接登录' + app.globalData.userInfo.uid)
        that.getUserReferrerOrGameInfo(app.globalData.userInfo.uid);
      }
    }
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
  getUserReferrerOrGameInfo: function (userID, platform) {
    let that = this;
    wx.showLoading({
      title: '图片生成中...',
      mask: true
    })
    platform = platform || '';
    wx.request({
      url: 'http://bjtest.bianjiwangluo.cn/h5agency/phpTransfer/mgApi.php?service=App.Referrer_ReferrerInfo.GetPlatformUrlInfo',
      data: {
        user_id: userID,
        platform: platform
      },
      success(res) {
        app.globalData.lastPlatform = res.data.data.platform;
        that.baseID = res.data.data.base_id;
        that.setData({
          showReferrerInterface: res.data.data.is_referrer
        })
        wx.setStorageSync('isReferrer', res.data.data.is_referrer);
        that.showAreaAndGamePlatformChanged();
        if (res.data.data.is_referrer) that.createPathFromQrcode(res.data.data.url, 140);
        else that.createPathFromQrcode(res.data.data.url, 110);
      }
    })
  },

  // 切换区域事件
  switchArea: function (e) {
    let that = this;
    let userID = app.globalData.userInfo.uid;
    let platform = that.platformArr[e.detail.value].platform;
    that.getUserReferrerOrGameInfo(userID, platform);
  },

  // 生成二维码图片返回路径
  createPathFromQrcode: function (link, width) {
    let that = this;
    let qrcode_w = width / rate; // 160rpx 在6s上为 80px
    that.setData({
      qrcode_w: qrcode_w
    })
    const query = wx.createSelectorQuery();
    query.select('#qrcode')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        let canvas = res[0].node;

        // 调用第三方库生成二维码
        drawQrcode({
          canvas: canvas,
          canvasId: 'qrcode',
          width: qrcode_w,
          padding: 2,
          background: '#ffffff',
          foreground: '#000000',
          text: link,
          correctLevel: 0
        })

        // 获取二维码的临时路径
        wx.canvasToTempFilePath({
          canvas: canvas,
          canvasId: 'qrcode',
          success(res) {
            that.drawPictureByQrcodeAndBg(res.tempFilePath);
          },
          fail(res) {
            console.error(res)
          }
        })
      })
  },

  // 合成二维码和背景图
  drawPictureByQrcodeAndBg: function (qrcodePath) {
    let that = this;
    const query = wx.createSelectorQuery();
    query.select('#sharePic')
      .fields({
        node: true,
        size: true
      })
      .exec(async (res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio; // 获取设备像素比
        const mainImg = canvas.createImage();
        if (that.data.showReferrerInterface) mainImg.src = '../../images/img_referrer_picture.png';
        else mainImg.src = '../../images/img_game_picture.png';
        let mainImgPo = await new Promise((resolve, reject) => {
          mainImg.onload = () => {
            resolve(mainImg);
          }
          mainImg.onerror = (e) => {
            reject(e);
          }
        });
        let mainH = mainImgPo.height / rate; // rpx转为px
        let mainW = mainImgPo.width / rate;
        that.setData({
          sharePic_h: mainH,
          sharePic_w: mainW
        })
        canvas.width = mainW * dpr;
        canvas.height = mainH * dpr;
        ctx.scale(dpr, dpr);
        ctx.drawImage(mainImgPo, 0, 0, mainW, mainH); // 绘制背景

        const qrcodeImg = canvas.createImage();
        qrcodeImg.src = qrcodePath;
        let qrcodeImgPo = await new Promise((resolve, reject) => {
          qrcodeImg.onload = () => {
            resolve(qrcodeImg);
          }
          qrcodeImg.onerror = (e) => {
            reject(e)
          }
        });
        let qrcodeX;
        let qrcodeY;
        let areaX;
        let areaY;
        let fontSize = (24 / rate) + 'px bold';
        ctx.font = fontSize;
        ctx.fillStyle = '#ffffff';
        if (that.data.showReferrerInterface) {
          qrcodeX = 90 / rate;
          qrcodeY = 320 / rate;
          areaX = 266 / rate;
          areaY = 404 / rate;
        } else {
          qrcodeX = 130 / rate;
          qrcodeY = 270 / rate;
          areaX = 276 / rate;
          areaY = 332 / rate;
        }
        ctx.drawImage(qrcodeImgPo, qrcodeX, qrcodeY, that.data.qrcode_w, that.data.qrcode_w);
        ctx.fillText(that.data.currentArea, areaX, areaY);

        wx.canvasToTempFilePath({
          canvas: canvas,
          canvasId: 'sharePic',
          success(res) {
            if (that.data.showReferrerInterface) {
              if (app.globalData.showReferrerPopup != '') {
                app.globalData.showReferrerPopup = '';
                that.setData({
                  referrerSharePicture: res.tempFilePath,
                  showReferrerPopup: 1,
                })
              } else {
                that.setData({
                  referrerSharePicture: res.tempFilePath
                })
              }
            } else {
              that.setData({
                gameSharePicture: res.tempFilePath
              })
            }
            wx.hideLoading();
          },
          fail(res) {
            console.error(res)
          }
        })
      })
  },

  // 点击轮播图跳转到其他页面
  goToOtherPage: function () {
    wx.navigateTo({
      url: '/pages/referrer/referrer',
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
        if (app.globalData.lastPlatform != platformArr[i].platform) {
          platformArr[i].platform = app.globalData.lastPlatform;
        }
        that.platformArr = platformArr;
        that.setData({
          currentArea: platformArr[i].name,
        })
        break;
      }
    }
  },

  // 保存游戏图片到手机
  saveGamePicInPhone: function () {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.gameSharePicture,
      success(res) {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success',
          duration: 1500
        })
      },
      fail(res) {
        that.getPhotosAuthorize();
      }
    })
  },

  // 保存发展人图片到手机
  saveReferrerPicInPhone: function () {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.referrerSharePicture,
      success(res) {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success',
          duration: 1500
        })
      },
      fail(res) {
        that.getPhotosAuthorize();
      }
    })
  },

  getPhotosAuthorize: function () {
    let that = this;
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.showModal({
            title: '提示',
            content: '若点击不授权，将无法使用保存图片功能',
            cancelText: '不授权',
            cancelColor: '#999',
            confirmText: '授权',
            confirmColor: '#f94218',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (that.data.showReferrerInterface) that.saveReferrerPicInPhone();
                    else that.saveGamePicInPhone();
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  // 了解发展人详情事件
  referrerDetail: function () {
    wx.navigateTo({
      url: '/pages/referrer/referrer',
      success: function (res) {}
    })
  },

  // 关闭发展人弹窗事件
  closePopup: function () {
    let that = this;
    that.setData({
      showReferrerPopup: 0
    })
  },

  // 获取用户手机号
  getPhoneNumber: function (e) {
    let that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: 'http://nbmjtest.fhabc.com:8001/?s=ApiWxApp.WxaAuth.GetUserPhoneRegisterReferrer',
        data: {
          session_key: app.globalData.userInfo.session_key,
          encrypted_data: e.detail.encryptedData,
          iv: e.detail.iv,
          union_id: app.globalData.userInfo.union_id,
          open_id: app.globalData.userInfo.open_id,
          nick_name: app.globalData.userInfo.name,
          head_img: app.globalData.userInfo.userface,
          sex: app.globalData.userInfo.sexid,
          platform: app.globalData.lastPlatform
        },
        success(res) {
          app.globalData.showReferrerPopup = 1;
          that.getUserReferrerOrGameInfo(app.globalData.userInfo.uid);
        }
      })
    } else {
      wx.showToast({
        title: '您拒绝了授权',
        icon: 'error',
        duration: 1500
      })
    }
  },
})