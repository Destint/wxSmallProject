// 首页
const app = getApp();

Page({
  // 初始数据
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 判断小程序的API，回调，参数，组件等是否在当前版本可用
    userGameID: "", // 用户游戏id
    userDiamond: "", // 用户钻石数
    userLastGamePlatform: '', // 用户上一次游戏平台
    gameBaseId: '', // 游戏基础id
    noticeList: [], // 文字广播列表
    bannerList: [], // 轮播图列表
    isShowGameLink: true, // 是否显示游戏链接界面
    gameArea: '', // 游戏区域
    gameLink: '', // 游戏链接
    referrerLink: '', // 发展人链接
    areaArray: ['宁波地区', '象山地区', '宁海地区', '奉化地区'], // 区域选择
    // 活动公告列表
    eventAnnouncementList: [{
        type: "/images/event_icon.png",
        title: "新春福利1：新注册用户及老用户回归免费送钻",
        time: "2021-02-10",
        content: [{
            title: "活动时间：",
            content: "2月9日—2月26日",
          }, {
            title: "赠送对象：",
            content: "1、2月9日后首次登录游戏的新用户\n2、1月9日后未登录过的老用户",
          },
          {
            title: "领取方式：",
            content: "在活动期间内，满足以上两种情况的用户登录游戏后系统自动发放"
          }
        ],
      },
      {
        type: "/images/event_icon.png",
        title: "新春福利2：除夕至初四，玩游戏，免费领福袋",
        time: "2021-02-10",
        content: [{
          title: "活动时间：",
          content: "2月11日—2月14日",
        }, {
          title: "活动内容：",
          content: "活动期间，每天13:00、21：00两个时间点，在牌局中的用户可以在游戏界面领取福袋，每个时间段每个ID仅可领取一次，名额有限，抢完为止",
        }],
      },
      {
        type: "/images/event_icon.png",
        title: "新春福利3：新春道具免费送",
        time: "2021-02-10",
        content: [{
          title: "活动时间：",
          content: "2月4日—2月26日",
        }, {
          title: "活动内容：",
          content: "活动期间，玩家首次登录游戏，系统自动赠送新春道具5套，每个ID限送一次",
        }],
      }
    ],
    // 游戏不同地区平台列表
    platformArr: []
  },
  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    wx.showShareMenu(); // 开启分享
    let that = this;
    that.getNotices(); // 获取喇叭公告
    that.getBanners(); // 获取轮播图
  },
  // 页面加载（每次都调用）
  onShow: function () {
    let that = this;
    that.getUserInfo(); // 登录获取用户uid和钻石及地区链接
  },
  // 分享给朋友的页面设置
  onShareAppMessage: function (res) {
    return {
      title: '发展人、游戏链接入口在这里！赶快收藏呀~',
      path: '/pages/home/home',
      imageUrl: '/images/share_bg.png'
    }
  },
  // 获取喇叭公告
  getNotices: function () {
    let that = this;
    wx.request({
      url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaMedia.GetNotices',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          noticeList: res.data.data.list
        })
      }
    })
  },
  // 获取轮播图
  getBanners: function () {
    let that = this;
    wx.request({
      url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaMedia.GetBanners',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          bannerList: res.data.data.list
        })
      }
    })
  },
  // 登录获取用户uid和钻石及地区链接
  getUserInfo: function () {
    let that = this;
    wx.getSetting({
      // 判断用户是否授权登录
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 用户已授权登录信息
          wx.login({
            success: function (res_login) {
              if (res_login.code) {
                wx.getUserInfo({
                  success: function (res) {
                    wx.request({
                      url: 'https://me.txy78.com/h5agency/phpTransfer/gameApi.php?service=ApiWxApp.WxaAuth.GetUserInfoByJsCode',
                      header: {
                        'Content-Type': 'application/json'
                      },
                      data: {
                        js_code: res_login.code,
                        encrypted_data: res.encryptedData,
                        iv: res.iv
                      },
                      success(res_userInfo) {
                        wx.request({
                          url: 'https://me.txy78.com/h5agency/phpTransfer/mgApi.php?service=App.Referrer_ReferrerInfo.GetPlatformUrlInfo',
                          header: {
                            'Content-Type': 'application/json'
                          },
                          data: {
                            user_id: res_userInfo.data.data.uid,
                            platform: res_userInfo.data.data.before_login_platform,
                          },
                          success(res_url) {
                            that.setData({
                              userGameID: res_userInfo.data.data.uid,
                              userDiamond: res_userInfo.data.data.money,
                              userLastGamePlatform: res_userInfo.data.data.before_login_platform,
                              gameBaseId: res_userInfo.data.data.base_id,
                              gameLink: res_url.data.data.game_url,
                              referrerLink: res_url.data.data.referrer_url
                            })
                            that.showAreaAndGamePlatformChanged();
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    });
  },
  // 选择区域事件
  chooseArea: function (e) {
    let that = this;
    wx.request({
      url: 'https://me.txy78.com/h5agency/phpTransfer/mgApi.php?service=App.Referrer_ReferrerInfo.GetPlatformUrlInfo',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        user_id: that.data.userGameID,
        platform: that.data.platformArr[e.detail.value].platform,
      },
      success(res) {
        that.setData({
          gameArea: that.data.areaArray[e.detail.value],
          gameLink: res.data.data.game_url,
          referrerLink: res.data.data.referrer_url
        })
      }
    })
  },
  // 点击更多按钮事件
  clickMore: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/moreEventAnnouncement/moreEventAnnouncement',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: that.data.eventAnnouncementList
        })
      }
    })
  },
  // 点击活动公告按钮事件
  clickEventAnnouncement: function (e) {
    let eventAnnouncementData = e.currentTarget.dataset.data; // 获取活动公告内容
    wx.navigateTo({
      url: '/pages/eventAnnouncement/eventAnnouncement',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: eventAnnouncementData
        })
      }
    })
  },
  // 点击轮播图跳转到其他页面
  goToOtherPage: function (e) {
    wx.switchTab({
      url: `${e.currentTarget.dataset.url}`,
      success: function (res) {}
    })
  },
  // 选择游戏链接
  chooseGameLink: function () {
    let that = this;
    that.setData({
      isShowGameLink: true
    })
  },
  // 选择游戏公告
  chooseGameAnnouncement: function () {
    let that = this;
    that.setData({
      isShowGameLink: false
    })
  },
  // 复制游戏链接
  copyGameLink: function () {
    let that = this;
    wx.setClipboardData({
      data: that.data.gameLink,
      success: function (res) {
        wx.hideToast()
        wx.showToast({
          title: '复制成功，请粘贴到微信后使用',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 复制发展人链接
  copyReferrerLink: function () {
    let that = this;
    wx.setClipboardData({
      data: that.data.referrerLink,
      success: function (res) {
        wx.hideToast()
        wx.showToast({
          title: '复制成功，请粘贴到微信后使用',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 显示地区及游戏平台号变更
  showAreaAndGamePlatformChanged: function () {
    let that = this;
    let platformArr = [{
        id: 0,
        name: '宁波地区',
        platform: 777,
        baseId: 777,
      },
      {
        id: 1,
        name: '象山地区',
        platform: 1172,
        baseId: 999,
      },
      {
        id: 2,
        name: '宁海地区',
        platform: 1244,
        baseId: 1244,
      },
      {
        id: 3,
        name: '奉化地区',
        platform: 1264,
        baseId: 888,
      }
    ];
    for (var i = 0; i < platformArr.length; i++) {
      if (that.data.gameBaseId == platformArr[i].baseId) {
        if (that.data.userLastGamePlatform != platformArr[i].platform) {
          platformArr[i].platform = that.data.userLastGamePlatform;
        }
        that.setData({
          platformArr: platformArr,
          gameArea: platformArr[i].name,
        })
        break;
      }
    }
  },
})