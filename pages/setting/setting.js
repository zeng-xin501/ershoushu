Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  doPersonClick:function(e){
    let that=this;
    console.log('detail按钮被点击', e)
    wx.redirectTo({
      url: '/pages/setting/person/person'
    })
  },
  doAddClick:function(){
    wx.redirectTo({
      url: '/pages/setting/address/address'
    })
  },

  doAccouClick:function(){
    wx.redirectTo({
      url: '/pages/setting/account/account'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})