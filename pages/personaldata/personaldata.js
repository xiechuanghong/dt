// pages/basicdata/basicdata.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexArr: ["男", "女"],
    textSum: 32,
    region: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      PCardID: options.PCardID
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
    this.getCardInfo()
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

  // 选择性别
  bindPickerChangeSex(e) {
    console.log(e)
    this.setData({
      sex: e.detail.value
    })
  },

  // 选择时间
  bindDateChange: function(e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  // 获取文本域内容
  bindGetTextVal(e) {
    let textSum = 32
    textSum = textSum - e.detail.cursor
    this.setData({
      textSum
    })
    console.log(textSum)
  },

  // 选择地区
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  // 关闭所有页面跳转到我的
  onNavCardDetail() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  // 获取名片详情信息
  getCardInfo() {
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'CardPersonal/GetCardInfo',
        method: 'get',
        data: {
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          if (res.data.State == 'Success') {
            let region = that.data.region
            region[0] = res.data.Result.Province
            region[1] = res.data.Result.City
            region[2] = res.data.Result.District
            if (!res.data.Result.Province) {
              region = []
            }
            that.setData({
              cardDetail: res.data.Result,
              userInfo: app.globalData.userInfo,
              region
            })
            console.log(res.data.Result)
          }
        }
      })
    })
  },

  // 获取表单值
  formSubmit(e) {
    let that = this
    let formValue = e.detail.value
    let regionArr = formValue.regionArr.split(',')
    console.log(regionArr)
    wx.request({
      url: app.globalData.url + 'CardPersonal/EditCardInfo',
      method: 'post',
      data: {
        UserID: app.globalData.userInfo.UserID,
        PCardID: that.data.PCardID,
        Email: formValue.Email || ' ',
        WeChatCode: formValue.WeChatCode || ' ',
        Phone: formValue.Phone || ' ',
        EnterpriseName: formValue.EnterpriseName || ' ',
        Address: formValue.Address || ' ',
        Province: regionArr[0],
        City: regionArr[1],
        District: regionArr[2]
      },
      success(res) {
        if (res.data.State == 'Success') {
          wx.showToast({
            title: '修改成功',
            success(res) {
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/home/home',
                })
              }, 1500)
              console.log(res)
            }
          })
        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none'
          })
        }
      }
    })
    console.log(e)
  },

  // 清空文本框
  bindDelVal(e) {
    let val = e.currentTarget.dataset.val
    let cardDetail = this.data.cardDetail
    cardDetail[val] = ''
    this.setData({
      cardDetail
    })
  }
})