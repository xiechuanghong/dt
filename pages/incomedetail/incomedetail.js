// pages/incomedetail/incomedetail.js
const app = getApp()
const moment = require('../../utils/moment.min.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeDetailArr: [{
        money: 60,
        state: '处理中',
        isAdd: true
      },
      {
        money: 40,
        state: '提现失败,资金返回余额',
        isAdd: false
      },
      {
        money: 770,
        state: '处理中',
        isAdd: true
      },
      {
        money: 230,
        state: '提现失败,资金返回余额',
        isAdd: false
      },
      {
        money: 534,
        state: '提现失败,资金返回余额',
        isAdd: false
      },
      {
        money: 637,
        state: '提现失败,资金返回余额',
        isAdd: false
      },
      {
        money: 333,
        state: '处理中',
        isAdd: true
      },
      {
        money: 555,
        state: '处理中',
        isAdd: true
      },
    ],
    incomeData:{
      Data:[],
      Page:{}
    },
    currentId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.getList()
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
    if (!this.data.incomeData.Page.HasNextPage) {
      return
    }
    this.getList(++this.data.incomeData.Page.PageNumber, this.data.currentId)
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },

  // 点击tab切换
  onTabSwitch(e) {
    let that = this
    let id = e.target.dataset.id
    let incomeData = this.data.incomeData
    incomeData.Data = []
    this.setData({
      currentId: id,
      incomeData
    }, () => {
      that.getList(1, id)
    })
  },

  // 获取收支明细
  getList(Page, Type) {
    wx.showLoading({
      title: '正在加载中',
      mask: true
    })
    let that = this
    wx.request({
      url: app.globalData.url + 'VipAmount/GetList',
      method: 'get',
      data: {
        UserID: app.globalData.userInfo.UserID,
        PageSize: 10,
        Page: Page || 1,
        Type: Type || 0,
        Date: moment(new Date().setDate(1)).format("YYYY-MM-DD")
      },
      success(res) {
        if (res.data.State == 'Success') {
          let incomeData = that.data.incomeData
          incomeData.Data.push(...res.data.Result.Data)
          incomeData.Page = res.data.Result.Page
          that.setData({
            incomeData
          }, () => {
            wx.hideLoading()
          })
          console.log(res)
        }
      }
    })
  }
})