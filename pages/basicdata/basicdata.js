// pages/basicdata/basicdata.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexArr: ["请选择", "男", "女"],
    textSum: 32,
    sex:0
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

  // 获取表单值
  formSubmit(e) {
    let that = this
    let formValue = e.detail.value
    wx.request({
      url: app.globalData.url + 'CardPersonal/EditCardInfo',
      method: 'post',
      data: {
        UserID: app.globalData.userInfo.UserID,
        PCardID: that.data.PCardID,
        Avatar: formValue.Avatar,
        Birthday: formValue.Birthday,
        Gender: that.data.sex,
        Industry: formValue.Industry || ' ',
        Name: formValue.Name || ' ',
        Position: formValue.Position || ' ',
        Remark: formValue.Remark || ' ',
      },
      success(res) {
        if(res.data.State == 'Success') {
          wx.navigateTo({
            url: '/pages/personaldata/personaldata?PCardID=' + that.data.cardDetail.PCardID,
          })
        } else {
          wx.showToast({
            title: res.data.Message,
            icon:'none'
          })
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.Message,
          // })
        }
        console.log(res)
      }
    })
    console.log(e)
  },

  // 上传图片到七牛云
  uploadAvatar() {
    let that = this
    // let formData = new FormData();
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.uploadFile({
          url: app.globalData.url + 'Uploader/Upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'server': '1'
          },
          success(res) {
            let str = JSON.parse(res.data)
            console.log(res, str)
            if (str.State == 'Success') {
              that.setData({
                uploadAvatar: str.Result
              })
            }
          }
        })
      },
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
            that.setData({
              cardDetail: res.data.Result,
              userInfo: app.globalData.userInfo,
              sex:res.data.Result.Gender
            })
          }
        }
      })
    })
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