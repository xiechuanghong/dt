// pages/carddetail/carddetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showLoading({
      title: '正在加载中',
      mask: true
    })
    this.getCardInfo().then((res) => {
      that.setData({
        State: res.data.State,
        cardDetail: res.data.Result,
        userInfo: app.globalData.userInfo
      }, () => {
        wx.hideLoading()
      })
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
    let that = this
    this.getCardInfo().then((res) => {
      that.setData({
        State: res.data.State,
        cardDetail: res.data.Result,
        userInfo: app.globalData.userInfo
      })
    })
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
  onShareAppMessage: function(options) {
    let that = this
    return {
      title: this.data.cardDetail.Name + '的个人名片',
      path: '/pages/test1/test1?Type=1&PCardID=' + that.data.cardDetail.PCardID,
      imageUrl: this.data.cardDetail.Avatar,
      success: (res) => {
        // app.userLog(that.data.cardDetail.CardID, 63)
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },

  // 点击靠谱
  onCollection() {
    let {
      cardDetail
    } = this.data
    cardDetail.HadLike = !cardDetail.HadLike
    cardDetail.HadLike ? ++cardDetail.LikeCount : --cardDetail.LikeCount
    app.userLog(cardDetail.PCardID, 201)
    this.setData({
      cardDetail: cardDetail
    })
  },

  // 获取用户手机号
  getUserPhone(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      app.globalData.userInfo.iv = e.detail.iv;
      app.globalData.userInfo.encryptedData = e.detail.encryptedData
      wx.request({
        url: app.globalData.url + 'Account/GetPhoneNumberFromWeChat',
        method: 'get',
        data: {
          UserID: app.globalData.userInfo.UserID,
          IV: e.detail.iv,
          EncryptedData: e.detail.encryptedData
        },
        success(res) {
          if (res.data.State == 'Success') {
            wx.navigateTo({
              url: '/pages/invite/invite?phone=' + res.data.Result + '&url=2',
            })
          }
          console.log(res)
        }
      })
    }
  },

  // 获取个人中心状态
  getCardInfo() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'CardPersonal/GetCardInfo',
        method: 'get',
        data: {
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          console.log(res)
          if (res.data.State == 'PCardNoFound' || res.data.State == 'Success') {
            resolve(res)
          }
        }
      })
    })
  },

})