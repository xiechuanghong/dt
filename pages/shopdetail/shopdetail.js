// pages/shopDetail/shopDetail.js
const app = getApp();
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperArr: [{
      img: '/img/20180420095435718.jpg'
    },
    {
      img: '/img/a221398039814aaaa27df0ef7aeda19c.jpeg'
    },
    {
      img: '/img/18780c7bee754319b0d9b4361e47c5ac.jpeg'
    },
    {
      img: '/img/86b1133724a845bca4457f3d2a44f65a.jpeg'
    },
    {
      img: '/img/e8f491289ef140b2a7076f33f72da8e4.jpeg'
    },
    ],
    current: 1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getProductDetails(options.ProductID)
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowWidth + 'px'
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {
    let that = this
    return {
      title: that.data.productDetail.Name,
      imageUrl: that.data.productDetail.Images[0],
      path: '/pages/test1/test1?Type=3&ProductID=' + that.data.productDetail.ProductID
    }
  },

  /**
   * 轮播事件
   */
  onSwiperChange(e) {
    this.setData({
      current: e.detail.current + 1
    })
  },

  /**
   * 获取商品详情
   */
  getProductDetails(productID) {
    wx.showLoading({
      title: '这种加载中',
    })
    let that = this
    wx.request({
      url: app.globalData.url + 'Products/GetProductDetails',
      method: 'get',
      data: {
        EnterpriseID: 17,
        ProductID: productID
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            productDetail: res.data.Result
          }, () => {
            wx.hideLoading()
          })
          WxParse.wxParse('content', 'html', res.data.Result.DetailContent, that)
        }
      }
    })
  },

  /**
   * 导航到tabbar页
   */
  onNavigateToShop() {
    wx.reLaunch({
      url: '/pages/shop/shop',
    })
  }
})