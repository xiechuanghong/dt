// pages/poster/poster.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPostersAfterGenerate(options.PCardID)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('渲染完毕')
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
  // onShareAppMessage: function() {

  // },

  // 监听图片是否加载完
  imageLoad(e) {
    if(e.type == 'load') {
      this.setData({
        width:303+ 'px',
        height:452+ 'px'
      },()=>{
        wx.hideLoading()
      })
    }
    console.log(e)
  },

  /**
   * 轮播图滑动事件
   */
  onChangeSwiper: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  // 获取海报
  getPostersAfterGenerate(PCardID) {
    wx.showLoading({
      title: '海报生成中',
    })
    let that = this
    return new Promise((resolve, rejcet) => {
      wx.request({
        url: app.globalData.url + 'CardPersonal/GetPostersAfterGenerate',
        method: 'get',
        data: {
          PCardID: PCardID
        },
        success(res) {
          if (res.data.State == 'Success') {
            resolve(res)
            that.setData({
              Posters:res.data.Result
            })
            console.log(res)
          }
        }
      })
    })

  },

  // 保存海报
  bindPoster() {
    if (this.data.Posters.length==0) {
      return
    }
    console.log(12345)
    var that = this
    wx.getImageInfo({
      src: that.data.Posters[that.data.current],
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showModal({
              title: '保存海报成功',
              content: '名片海报已保存到手机相册,你可以分享到朋友圈了',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.setData({
                    openMask: false
                  })
                }
              }
            })
          }
        })
      }
    })
  },
})