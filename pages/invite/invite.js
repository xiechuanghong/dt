// pages/invite/invite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      phone: options.phone,
      url: options.url,
      code:app.globalData.Code || ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 跳转到名片详情页面
  onNavigateTo() {
    let that = this
    wx.showLoading({
      title: '注册中',
      mask:true
    })
    this.login().then((res) => {
      wx.request({
        url: app.globalData.url + 'VIP/CreateByWeChatPhone',
        method: 'post',
        data: {
          UserID: app.globalData.userInfo.UserID,
          IV: app.globalData.userInfo.iv,
          EncryptedData: app.globalData.userInfo.encryptedData,
          Code: that.data.codeVal || that.data.code
        },
        success(res) {
          if (res.data.State == 'Success') {
            wx.hideLoading()
            if (that.data.url == 1) {
              wx.redirectTo({
                url: '/pages/pay/pay',
              })
            } else {
              wx.redirectTo({
                url: '/pages/mycarddetail/mycarddetail?modal=true',
              })
            }
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.Message,
            })
          }
          console.log(res)
        }
      })
    }).catch((res) => {
      wx.showModal({
        title: '提示',
        content: res,
      })
    })


  },

  /**
   * 登陆
   */
  login() {
    let that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: function(res) {
          wx.request({
            url: app.globalData.url + 'Account/LoginByWeiXin',
            method: 'post',
            data: {
              Code: res.code,
              Type: 2
            },
            success(res) {
              if (res.data.State == 'Success') {
                resolve(res)
              } else {
                reject(res.data.Message)
              }
            }
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    })


  },

  // 获取邀请码
  getCode(e) {
    this.setData({
      codeVal:e.detail.value
    })
    console.log(e)
  }
})