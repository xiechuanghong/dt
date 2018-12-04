// pages/test1/test1.js
const app = getApp()
let Type
let PCardID
let navigateToUrl
// const base = require('../../utils/wx_im/base64.js')
// const json2 = require('../../utils/wx_im/json2.js')
// const webim = require('../../utils/wx_im/webim_wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let getType = this.getUrlPara(decodeURIComponent('pages/test1/test1?scene=Type%3D1%26PCardID%3D5')).PCardID
    // Type = options.Type || 1 || 0
    // PCardID = options.PCardID || 5
    Type = options.Type || this.getUrlPara(decodeURIComponent(options.scene)).Type || 0
    PCardID = options.PCardID || this.getUrlPara(decodeURIComponent(options.scene)).PCardID

    console.log(Type, PCardID)
    navigateToUrl = [
      '/pages/radarring/radarring',
      '/pages/carddetail/carddetail?PCardID=' + PCardID + "&share=true",
      '/pages/Profit/Profit'
    ]
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    let that = this
    // 查看是否授权
    // wx.getSetting({
    //   success: function(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.showLoading({
    //         title: '正在跳转中',
    //       })
    //       wx.getUserInfo({
    //         success: function(res) {
    //           console.log(Type)
    //           wx.reLaunch({
    //             url: navigateToUrl[Type]
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.login()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }

  // 获取名片详情信息
  getCardInfo(PCardID, UserID) {
    let that = this;
    wx.request({
      url: app.globalData.url + 'CardPersonal/GetCardInfo',
      method: 'get',
      data: {
        PCardID: PCardID,
        UserID: UserID
      },
      success(res) {
        console.log(res)
        if (res.data.State == 'Success') {
          app.globalData.Code = res.data.Result.Code || ''
        } else {
          console.log(res)
        }
      }
    })
  },

  /**
   * 登陆
   */
  login() {
    let that = this
    wx.login({
      success: function (res) {
        wx.request({
          url: app.globalData.url + 'Account/LoginByWeiXin',
          method: 'post',
          data: {
            Code: res.code,
            Type: 2
          },
          success(res) {
            console.log(res)
            if (res.data.State == 'Success') {
              let data = res.data.Result
              app.globalData.openId = data.OpenID
              app.globalData.unionId = data.UnionID
              // app.globalData.userInfo = data.User
              let User = wx.getStorageSync('User')
              console.log(User)
              if (data.User) {
                console.log(data.User)
                wx.showLoading({
                  title: '正在跳转中',
                })
                wx.reLaunch({
                  url: navigateToUrl[Type]
                })
                app.globalData.userInfo = data.User
                if (PCardID) {
                  console.log(123)
                  that.getCardInfo(PCardID, res.data.Result.User.UserID)
                }
                return
              }
              if (data.OpenID == User.OpenID) {
                console.log('openid相等 是同一个人', data.OpenID, User.OpenID)
                if (PCardID) {
                  console.log(123)
                  that.getCardInfo(PCardID, User.UserID)
                }
                app.globalData.userInfo = User
                wx.showLoading({
                  title: '正在跳转中',
                })
                wx.reLaunch({
                  url: navigateToUrl[Type]
                })
              } else {
                console.log('openid不相等 不是同一个')
                that.setData({
                  isShow: true
                })
              }
            }
          }
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 用户授权
   */
  bindGetUserInfo: function (e) {
    console.log(e)
    let that = this
    if (e.detail.userInfo) {
      app.globalData.encryptedData = e.detail.encryptedData
      app.globalData.iv = e.detail.iv
      //用户按了允许按钮
      if (!app.globalData.userInfo) {
        console.log('没有注册，开始注册账号')
        that.register(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl, app.globalData.unionId, e.detail.encryptedData, e.detail.iv, app.globalData.openId).then((res) => {
          let User = wx.getStorageSync('User')
          wx.reLaunch({
            url: navigateToUrl[Type]
          })
          console.log(12345)
          if (PCardID) {
            that.getCardInfo(PCardID, User.UserID)
          }
        }).catch((res) => {
          console.log(res)
        })
      } else {
        wx.reLaunch({
          url: navigateToUrl[Type]
        })
      }
    } else {
      //用户按了拒绝按钮
    }
  },

  /**
   * 注册用户
   */
  register(NickName, HeadImgUrl, UnionID, EncryptedData, IV, OpenID) {
    console.log(123)
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'Account/RegisterByWeiXin',
        method: 'post',
        data: {
          NickName: NickName,
          HeadImgUrl: HeadImgUrl,
          UnionID: UnionID,
          EncryptedData: EncryptedData,
          IV: IV,
          OpenID: OpenID || '',
          Type:2
        },
        success(res) {
          console.log(res)
          if (res.data.State == 'Success') {
            res.data.Result.OpenID = OpenID
            app.globalData.userInfo = res.data.Result
            console.log(res.data.Result)
            wx.setStorageSync('User', res.data.Result)
            console.log('注册成功')
            resolve()
          } else {
            reject('出错了')
            wx.showModal({
              title: '提示',
              content: '注册失败',
              showCancel: false
            })
          }
        },
        fail(res) {
          console.log(res)
        }
      })
    })
    console.log(OpenID)
  },

  sys() {
    let that = this
    wx.scanCode({
      success: (res) => {
        console.log(res)
        console.log(decodeURIComponent(res.scene))
      }
    })
  },

  /**
   * 截取url参数
   */
  getUrlPara(url) {
    var theRequest = new Object();
    let scene = url.split("&");
    for (var i = 0; i < scene.length; i++) {
      theRequest[scene[i].split("=")[0]] = unescape(scene[i].split("=")[1]);
    }
    return theRequest
  },
})