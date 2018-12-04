// pages/pay/pay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_fee: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    this.login().then((res) => {
      that.setData({
        result: res,
        total_fee: res.total_fee
      })
    }).catch((res) => {
      console.log(res)
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

  login() {
    return new Promise((resolve, reject) => {
      console.log(111)
      wx.login({
        success(res) {
          wx.request({
            url: app.globalData.url + 'VIP/UpGradeVIP',
            method: 'post',
            data: {
              Code: res.code,
              UserID: app.globalData.userInfo.UserID
            },
            success(res) {
              if (res.data.State == 'Success') {
                var resData = res.data.Result;
                resolve(resData)
              } else {
                reject(res.data.Message)
                console.log(res.data.Message);
              }
            }
          })
        }
      })
    })
  },

  onPay() {
    let result = this.data.result
    let that = this
    console.log(result)
    this.changVIP(2).then((res) => {
      wx.requestPayment({
        timeStamp: result.timeStamp,
        nonceStr: result.nonceStr,
        package: result.package,
        signType: result.signType,
        paySign: result.paySign,
        success(res) {
          if (res.errMsg == 'requestPayment:ok') {
            console.log(res)
            // wx.reLaunch({
            //   url: '/pages/paysuccess/paysuccess',
            // })
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/paysuccess/paysuccess',
              })
            }, 200)
            // wx.navigateTo({
            //   url: '/pages/paysuccess/paysuccess',
            // })
          }
        },
        fail(res) {
          that.changVIP(1)
          console.log(res);
        }
      })
    })

  },

  changVIP(state) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'Vip/ChangeVip',
        method: 'POST',
        data: {
          UserID: app.globalData.userInfo.UserID,
          State: state
        },
        success(res) {
          if (res.data.State == 'Success') {
            resolve(res)
          }
        }
      })
    })
  }
})