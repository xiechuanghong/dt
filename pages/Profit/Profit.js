// pages/Profit/Profit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipInfoState: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      payState: options.payState || false
    })

    this.getVipInfo().then((res) => {
      return that.getInfo()
    }).then((res) => {
      that.setData({
        profitInfo: res.data.Result
      })
    })
    console.log('页面加载完成')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('页面初次渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    // if (that.data.payState) {
      this.getVipInfo().then((res) => {
        return that.getInfo()
      }).then((res) => {
        that.setData({
          profitInfo: res.data.Result
        })
      })
    // }

    console.log('页面显示完成')
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
      title: '分享好友,即拿现金',
      path: '/pages/test1/test1?Type=2',
      imageUrl: '/img/img_sharevip.png',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },

  // 复制邀请码
  tapContentCopy(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.phone,
      success(res) {
        console.log(res)
        if (res.errMsg == 'setClipboardData:ok') {
        }
      }
    });
  },

  // 获取是否成为VIP
  getVipInfo() {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'Vip/GetVipInfo',
        method: 'get',
        data: {
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          if (res.data.State == 'Success') {
            console.log('注册成功', res)
            that.setData({
              vipInfoState: res.data.State,
              result: res.data.Result
            })
            resolve(res)
          } else if (res.data.State == 'VipNoFound') {
            that.setData({
              vipInfoState: res.data.State
            })
          }
        }
      })
    })

  },

  // 获取收益信息
  getInfo() {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'VipAmount/GetInfo',
        method: 'get',
        data: {
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          if (res.data.State == 'Success') {
            resolve(res)
          }
        }
      })
    })
  },

  // 成为vip跳转
  onNavVip() {
    if (this.data.result.State == 2) {
      wx.showToast({
        title: '订单正在处理中 请稍后~',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
    // if (this.data.vipInfoState == 'VipNoFound') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '您还没有创建名片,是否创建名片',
    //     success(res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //         wx.switchTab({
    //           url: '/pages/home/home',
    //         })
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/pay/pay',
    //   })
    //   console.log('跳转到支付界面')
    // }
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
              url: '/pages/invite/invite?phone=' + res.data.Result + '&url=1',
            })
          }
          console.log(res)
        }
      })
    }
  },
})