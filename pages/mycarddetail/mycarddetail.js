// pages/carddetail/carddetail.js
const app = getApp()
let pageCount = 1;
let PageNumber = 1;
let HasNextPage = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultArr: [],
    isInputShow: true,
    currentTab: 0, //预设当前项的值
    productsList: [],
    isPeriod: true,
    isMyCard: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let modal = options.modal || false
    this.setData({
      modal: modal
    })
    this.getEnterpriseInfo()
    this.getProductsList()
    this.getProductKindsList()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
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

  /**
   * 点击靠谱
   */
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

  /**
   * 手机呼叫
   */
  tapPhoneCall: function(event) {
    if (!event.currentTarget.dataset.phone) {
      return
    }
    let that = this
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone,
      success(res) {
        if (res.errMsg == 'makePhoneCall:ok') {
          // app.userLog(that.data.cardDetail.CardID, event.currentTarget.dataset.phoneid || 84)
        }
      }
    });
  },

  tapContentCopy: function(event, id) {
    wx.setClipboardData({
      data: event.currentTarget.dataset.copy,
      success(res) {
        console.log(res)
        if (res.errMsg == 'setClipboardData:ok') {
          // app.userLog(app.globalData.CardID, id)
        }
      }
    });
  },

  /**
   * 复制邮箱
   */
  onContentCopyEmail(event) {
    if (!this.data.cardDetail.Email) {
      return
    }
    this.tapContentCopy(event, 81)
  },

  /**
   * 复制公司
   */
  onContentCopyFirm(event) {
    if (!this.data.cardDetail.EnterpriseName) {
      return
    }
    this.tapContentCopy(event, 81)
  },

  /**
   * 复制微信号
   */
  onContentCopyWeChat(event) {
    if (!this.data.cardDetail.WeChatCode) {
      return
    }
    this.tapContentCopy(event, 50)
  },

  /**
   * 打开地图
   */
  tapMapNavigation: function(event) {
    if (!this.data.cardDetail.FullAddress) {
      return
    }
    this.tapContentCopy(event, 50)
    // if (!this.data.cardDetail.Address) {
    //   return
    // }
    // let that = this
    // wx.openLocation({
    //   latitude: that.data.cardDetail.Lat,
    //   longitude: that.data.cardDetail.Lng,
    //   scale: 18,
    //   name: '财富广场',
    //   address: event.currentTarget.dataset.address
    // })
  },

  /**
   * 存入手机通讯录
   */
  tapAddPhoneContact: function() {
    wx.addPhoneContact({
      firstName: this.data.cardDetail.Name,
      mobilePhoneNumber: this.data.cardDetail.Mobile,
      weChatNumber: this.data.cardDetail.WeChatCode,
      organization: this.data.cardDetail.EnterpriseName,
      title: this.data.cardDetail.Position,
      hostNumber: this.data.cardDetail.Phone,
      email: this.data.cardDetail.Email,
      workAddressStreet: this.data.cardDetail.Address,
    });
  },

  // 关闭遮罩
  onCloneModal() {
    console.log('关闭遮罩成功')
    this.setData({
      modal: false
    })
  },

  // 我的名片底部切换
  onTabSwitch(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let isMyCard = this.data.isMyCard
    if (id == 1) {
      isMyCard = true
    } else {
      isMyCard = false
    }
    this.setData({
      isMyCard
    })
  },

  /**
   * 跳转到商品详情页
   */
  goodsDetail(e) {
    wx.navigateTo({
      url: '/pages/shopdetail/shopdetail?ProductID=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 点击搜索事件
   */
  choice() {
    wx.navigateTo({
      url: '/pages/shop/search/search',
    })
    // wx.setNavigationBarTitle({
    //   title: '搜索名片'
    // })
    // this.setData({
    //   isInputShow: false,
    // })
  },

  /**
   * 滚动事件
   */
  onPageScroll: function(e) {
    // if (this.data.isInputShow) {
    //   let query = wx.createSelectorQuery();
    //   let that = this;
    //   query.select('.top-logo').boundingClientRect(function(rect) {
    //     // console.log(rect)
    //     if (e.scrollTop >= rect.height) {
    //       that.setData({
    //         fixednav: true
    //       })
    //     } else {
    //       that.setData({
    //         fixednav: false
    //       })
    //     }
    //   }).exec();
    // }
  },

  /**
   * 获取企业信息
   */
  getEnterpriseInfo() {
    let that = this
    wx.request({
      url: app.globalData.url + 'Products/GetEnterpriseInfo',
      method: 'get',
      data: {
        EnterpriseID: 17
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            enterpriseInfo: res.data.Result[0]
          })
        }
      }
    })
  },

  /**
   * 获取商品列表
   */
  getProductsList(kindID, page) {
    // wx.showLoading({
    //   title: '正在加载中',
    //   mask: true
    // })
    let that = this
    wx.request({
      url: app.globalData.url + 'Products/GetProductsList',
      method: 'get',
      data: {
        EnterpriseID: 17,
        KindID: kindID || '',
        PageSize: 10,
        page: page || 1
      },
      success(res) {
        if (res.statusCode == 200) {
          let productsList = that.data.productsList
          productsList.push(...res.data.Result.Data)
          that.setData({
            productsList: productsList,
            isPeriod: res.data.Result.Page.HasNextPage
          })
          if (!res.data.Result.Page.HasNextPage) {
            HasNextPage = true
          }
          PageNumber = res.data.Result.Page.PageNumber
          // wx.hideLoading()
        }
      }
    })
  },

  /**
   * 获取商品分类
   */
  getProductKindsList() {
    let that = this
    wx.request({
      url: app.globalData.url + 'Products/GetProductKindsList',
      method: 'get',
      data: {
        EnterpriseID: 17
      },
      success(res) {
        if (res.data.State == 'Success') {
          that.setData({
            productKindsList: res.data.Result
          })
        }
      }
    })
  },

  /**
   * 点击标题切换当前页时改变样式
   */
  swichNav: function(e) {
    HasNextPage = false
    if (this.data.currentTaB == e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current,
        kindid: e.target.dataset.id,
        productsList: []
      })
      this.getProductsList(e.target.dataset.id)
    }
  },

  /**
   * 初始化
   */
  init() {
    this.getCardInfo()
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
              userInfo: app.globalData.userInfo
            })
          }
        }
      })
    })
  }
})