// pages/mylove/mylove.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lovelist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that=this;
//====从本地存储中获取收藏的商品列表数组=============  
    let lvlist=wx.getStorageSync('lovelist');
    this.setData({
      lovelist:lvlist
    })
	},
	
	doshowDetail:function(e){
    let that=this;
    console.log('detail按钮被点击', e)
//获取整个商品对象，从页面使用data-product传递的参数信息   
  let pd=e.currentTarget.dataset.product
  console.log('index--pd====>',pd)
//将pd对象转为url参数形式(pname=xxx&price=xxx&....)
  pd=JSON.stringify(pd);//将json对象转化为json格式的字符串
  console.log('stringify-pd====>',pd)
  //将json字符串转为url参数形式
  pd=encodeURIComponent(pd);
  console.log("index-pd===转换为url后->",pd)
  wx.redirectTo({
    url: '/pages/detail/detail?product='+pd
  })
},

//移除收藏的商品的事件方法
dolovedelclick:function(e){
  let that=this;
  console.log('dolovedel--e--->', e)
  let pid=e.currentTarget.dataset.pid;
  console.log('dolovedel--pid-->', pid)
//根据商品编号的值获取商品对象在数组中的索引位置 
  let index=that.data.lovelist.findIndex(pd=>pd.pid==pid);
  console.log('dolovedel--index-->', index)
//根据索引位置从数组中移除对象
  that.data.lovelist.splice(index,1);
//将改变后的收藏列表存储到本地
  wx.setStorageSync('lovelist', that.data.lovelist)
  wx.showToast({
    title: '移除成功！',
    duration:2000
  })
  //重新刷新列表
  this.setData({
    lovelist:that.data.lovelist
  })
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