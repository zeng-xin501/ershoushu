// pages/myOrders/myOrders.js
Page({
  data: {
    currentTab: '2', // 默认显示待发货
    orders: [],
    filteredOrders: []
  },

  onLoad: function(options) {
    this.loadOrderData();
  },
  
  onShow: function() {
    this.loadOrderData();
  },
  
  loadOrderData: function() {
		wx.showLoading({
			title: '加载中...',
		});
		
		wx.request({
			url: 'http://127.0.0.1:3000/api/B_Orders',
			method: 'GET',
			success: (res) => {
				wx.hideLoading();
				if (res.data && Array.isArray(res.data)) {
					// 修改图片路径处理方式
					const orders = res.data.map(item => ({
						...item,
						image: `/images/${item.bookId}.jpg` // 修改为本地图片路径格式
					}));
					
					this.setData({
						orders: orders,
						filteredOrders: this.filterOrdersByTab(orders, this.data.currentTab)
					});
				}
			},
			fail: (err) => {
				wx.hideLoading();
				wx.showToast({
					title: '加载失败',
					icon: 'none'
				});
				console.error('订单加载错误:', err);
			}
		});
	},

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab,
      filteredOrders: this.filterOrdersByTab(this.data.orders, tab)
    });
  },
  
  filterOrdersByTab: function(orders, tab) {
    if (tab === 'all') return orders;
    return orders.filter(order => order.status.toString() === tab);
  },

  // 阻止事件冒泡
  stopPropagation: function(e) {
    e.stopPropagation();
  },

  confirmReceive: function(e) {
    const orderId = e.currentTarget.dataset.id;
    const that = this;
    
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          const updatedOrders = that.data.orders.map(order => {
            if (order.id === orderId) {
              return {
                ...order,
                status: 4,
                statusText: '已完成'
              };
            }
            return order;
          });
          
          wx.setStorageSync('orders', updatedOrders);
          
          that.setData({
            orders: updatedOrders,
            filteredOrders: that.filterOrdersByTab(updatedOrders, that.data.currentTab)
          });
          
          wx.showToast({
            title: '已确认收货',
            icon: 'success'
          });
        }
      }
    });
  },
  
  viewOrderDetail: function(e) {
    const order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?order=${encodeURIComponent(JSON.stringify(order))}`
    });
  },

  payOrder: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '模拟支付订单: ' + orderId,
      icon: 'none'
    });
  },

  reviewOrder: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '跳转到评价页面',
      icon: 'none'
    });
  }
})