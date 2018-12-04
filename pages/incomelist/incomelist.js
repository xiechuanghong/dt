// pages/incomelist/incomelist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentId: 0,
    incomeList: {
      Data: [],
      Page: {}
    },
    incomeListArr: [{},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ]
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
    this.init()
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
    if (!this.data.incomeList.Page.HasNextPage) {
      return
    }
    this.getVipAmount(++this.data.incomeList.Page.PageNumber, this.data.currentId)
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
    let incomeList = this.data.incomeList
    incomeList.Data = []
    this.setData({
      currentId: id, incomeList
    }, () => {
      that.getVipAmount(1, id)
      that.getMyVipAmount()
    })
  },

  // 初始化
  init() {
    this.getVipAmount()
    this.getMyVipAmount()
  },

  // 获取排行榜列表
  getVipAmount(Page, Type) {
    wx.showLoading({
      title: '正在加载中',
      mask:true
    })
    let that = this;
    wx.request({
      url: app.globalData.url + '/VipAmount/Top',
      method: 'get',
      data: {
        Page: Page || 1,
        Type: Type || 0,
        PageSize: 10,
      },
      success(res) {
        if (res.data.State == 'Success') {
          let incomeList = that.data.incomeList
          incomeList.Data.push(...res.data.Result.Data)
          incomeList.Page = res.data.Result.Page
          that.setData({
            incomeList
          },()=>{
            wx.hideLoading()
          })
          console.log(res)
        }
      }
    })
  },

  // 获取自己的排名
  getMyVipAmount() {
    let that = this;
    wx.request({
      url: app.globalData.url + 'VipAmount/MyRank',
      method: 'get',
      data: {
        UserID: app.globalData.userInfo.UserID
      },
      success(res) {
        if (res.data.State == 'Success') {
          that.setData({
            myIncomeList: res.data.Result
          })
          console.log(res)
        }
      }
    })
  }
})