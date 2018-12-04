// pages/paysuccess/paysuccess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"支付成功 订单正在处理中"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let payState = setInterval(() => {
      that.getVipInfo().then((res)=>{
        if (res.data.Result.Type == 1) {
          wx.showToast({
            title: '订单处理成功 您已成为VIP',
            success(res) {
              clearInterval(payState)
              setTimeout(()=>{
                wx.switchTab({
                  url: '/pages/Profit/Profit?payState=true',
                })
              },1500)
              console.log(res)
            }
          })
        }
        console.log(res)
      })
    }, 1000)
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


  // 获取付款状态
  getVipInfo() {
    return new Promise((resolve,reject) => {
      wx.request({
        url: app.globalData.url + 'Vip/GetVipInfo',
        method: 'get',
        data: {
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          if(res.data.State == 'Success') {
            resolve(res)
          }
        }
      })
    })

  }
})