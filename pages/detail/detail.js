// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:'',
    lovelist:[],
    cartlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that=this;
 //接受index页面传递的参数值
    let pd=options.product;
    console.log('detial--pd--->',pd)
    //将url参数转为json字符串
    pd=decodeURIComponent(pd);
    console.log('detail--pd字符串转换后-->',pd)
    //将json字符串转为json对象
    pd=JSON.parse(pd);
    console.log('detail--pd对象转换后-->',pd)
    
    this.setData({
      product:pd
    })
    //结束接收参数的值
    //从本地存储中获得收藏的商品列表数组
    let lvlist=wx.getStorageSync('lovelist');
    this.setData({
      lovelist:lvlist
    });
    if(that.data.lovelist==null||that.data.lovelist.length==0){
      this.setData({
        lovelist:[]
      })
    }
    console.log('detail---lovelist--->',that.data.lovelist)
    let calist=wx.getStorageSync('cartlist');
    this.setData({
      cartlist:calist
    });
    if(that.data.cartlist==null||that.data.cartlist.length==0){
      this.setData({
        cartlist:[]
      })
    }
    console.log('detail---cartlist--->',that.data.cartlist)
  },
//收藏事件的方法：获取传递的商品对象参数
doloveclick: function(e) {
  let that = this;
  console.log('doloveclick--->e-->', e);
  let pd = e.currentTarget.dataset.pd;
  console.log('dolikeclick--->pd-->', pd);
  
  // 将获取的对象添加到收藏的列表书组中
  that.data.lovelist.push(pd);
  console.log('doloveclick---->lovelist-->', that.data.lovelist);
  
  // 将收藏的商品列表保存到本地存储
  wx.setStorageSync('lovelist', that.data.lovelist);
  
  // 调用API更新数据库中的收藏状态
  wx.request({
    url: 'http://172.20.10.3:3000/api/like-book',
    method: 'POST',
    data: {
      bookId: pd.B_ID // 假设pd对象中有B_ID字段
    },
    success: (res) => {
      console.log('收藏状态更新成功:', res.data);
      if (res.data.success) {
        wx.showToast({
          title: '收藏成功',
          duration: 3000
        });
      } else {
        wx.showToast({
          title: '收藏失败: ' + (res.data.error || '未知错误'),
          icon: 'none',
          duration: 3000
        });
      }
    },
    fail: (err) => {
      console.error('请求失败:', err);
      wx.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none',
        duration: 3000
      });
    }
  });
},

  //购物事件的方法：获取传递的商品对象参数
  docartclick:function(e){
    let that=this;
    console.log('decartclick--->e-->',e)
    let pd=e.currentTarget.dataset.pd
		console.log('docartclick--->pd-->',pd)
    //将获取的对象添加到收藏的列表书组中
    that.data.cartlist.push(pd);
    console.log('docartclick---->cartlist-->',that.data.cartlist)
    //将收藏的商品列表保存到本地存储
    wx.setStorageSync('cartlist', that.data.cartlist)
    //收藏成功
    wx.showToast({
      title: '已添加到购物车',
      duration:3000
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