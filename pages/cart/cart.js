Page({

  /**
   * 页面的初始数据
   */
  data: {
		cartlist:[],
		totalPrice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadCartData()
	},
	
	loadCartData(){
//====从本地存储中获取购物车的商品列表数组=============  
		let cartlist=wx.getStorageSync('cartlist')||[];
		let totalPrice=cartlist.reduce((sum, item)=>sum + (parseFloat(item.price) ||0),0);
    this.setData({
			cartlist:cartlist,
			totalPrice:totalPrice.toFixed(2)
    });		
	},

//移除购物车的商品的事件方法
docartdelclick:function(e){
  let that=this;
  console.log('docartdel--e--->', e)
  let pid=e.currentTarget.dataset.id;
  console.log('docartdel--pid-->', pid)
//根据商品编号的值获取商品对象在数组中的索引位置 
  let index=that.data.cartlist.findIndex(pd=>pd.pid==pid);
  console.log('docartdel--index-->', index)
//根据索引位置从数组中移除对象
  that.data.cartlist.splice(index,1);
//将改变后的购物车列表存储到本地
  wx.setStorageSync('cartlist', that.data.cartlist)
  wx.showToast({
    title: '移除成功！',
    duration:2000
	})
	this.loadCartData();
  //重新刷新列表
  this.setData({
    cartlist:that.data.cartlist
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


checkout: function() {
  const that = this;
  
  if (this.data.cartlist.length === 0) {
    wx.showToast({
      title: '购物车为空',
      icon: 'none'
    });
    return;
  }

  // 获取所有要结算的书籍ID
  const bookIds = this.data.cartlist.map(item => item.B_ID);
  
  // 显示加载中
  wx.showLoading({
    title: '处理中...',
    mask: true
  });

  // 1. 先调用后端API更新数据库状态
  wx.request({
    url: 'http://127.0.0.1:3000/api/checkout',
    method: 'POST',
    data: {
			bookIds: that.data.cartlist.map(item => item.B_ID) // 传递B_ID数组
		},
		header: {
			'Content-Type': 'application/json' // 明确指定JSON格式
		},
    success: function(res) {
      wx.hideLoading();
      
      if (res.data.success) {
        // 数据库更新成功后，执行前端逻辑
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            // 创建订单（待取件状态）
            const newOrders = that.data.cartlist.map(item => ({
              id: 'order_' + Math.random().toString(36).substr(2, 9),
              bookName: item.B_name,
              price: item.B_price,
              status: 1,
              statusText: '代取件',
              bookInfo: item,
              createTime: new Date().getTime()
            }));

            // 更新订单状态（待发货）
            const updatedOrders = that.data.cartlist.map(item => ({
              id: 'order_' + Math.random().toString(36).substr(2, 9),
              bookName: item.B_name,
              price: item.B_price,
              status: 2, // 修改状态：待发货
              statusText: '待发货',
              bookInfo: item,
              createTime: new Date().getTime()
            }));

            // 合并订单到本地存储
            const existingOrders = wx.getStorageSync('orders') || [];
            const allOrders = [...updatedOrders, ...existingOrders];
            wx.setStorageSync('orders', allOrders);

            // 标记已售商品
            const soldItemIds = that.data.cartlist.map(item => item.B_ID);
            let existingSoldItems = wx.getStorageSync('soldItems') || [];
            existingSoldItems = [...new Set([...existingSoldItems, ...soldItemIds])];
            wx.setStorageSync('soldItems', existingSoldItems);

            // 清空购物车
            wx.setStorageSync('cartlist', []);
            
            // 刷新相关页面
            const pages = getCurrentPages();
            const indexPage = pages.find(page => page.route === 'pages/index/index');
            if (indexPage) {
              const displayList = indexPage.data.recommendList.filter(item => !soldItemIds.includes(item.B_ID));
              indexPage.setData({ displayList });
            }

            const categoryPage = pages.find(page => page.route === 'pages/category/category');
            if (categoryPage) {
              const availableBooks = categoryPage.data.originalBooks.filter(book => !soldItemIds.includes(book.B_ID));
              categoryPage.setData({
                books: availableBooks,
                originalBooks: availableBooks
              });
            }

            const sellPage = pages.find(page => page.route === 'pages/mysell/mysell');
            if (sellPage) {
              sellPage.loadOrderData();
            }

            const buyPage = pages.find(page => page.route === 'pages/myOrder/myOrder');
            if (buyPage) {
              buyPage.loadOrderData();
            }

            // 更新当前页面数据
            that.setData({
              cartlist: [],
              totalPrice: 0
            });
          }
        });
      } else {
        wx.showToast({
          title: '更新商品状态失败',
          icon: 'none'
        });
      }
    },
    fail: function() {
      wx.hideLoading();
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      });
    }
  });
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