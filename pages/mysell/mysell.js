Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 搜索关键词
    searchKeyword: '',
    // 当前选中的分类索引
    currentTabIndex: 0,
    // 分类列表
    tabs: ['全部', '待取件', '已取件', '待确认', '已完成'],
    // 订单列表数据
    orderList: [],
    // 筛选后的订单列表
    filteredOrderList: [],
    // 加载状态
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从后端加载订单数据
    this.fetchOrderData();
  },

  /**
   * 从后端API获取订单数据
   */
	fetchOrderData: function() {
		const that = this;
		that.setData({ isLoading: true });
		
		wx.request({
			url: 'http://127.0.0.1:3000/api/my-sell/pending-pickup',
			method: 'GET',
			data: {
				sellerId: 2 // 假设当前用户ID为2
			},
			success(res) {
				if (res.data.success) {
					// 转换数据格式，拼接本地图片路径
					const orders = res.data.data.map(item => ({
						id: item.id,
						bookId: item.bookId,
						bookName: item.bookName,
						price: item.price,
						status: item.status,
						statusText: item.statusText || '待取件',
						image: `/images/${item.bookId}.jpg`, // 本地图片路径
						createTime: new Date(item.createTime).getTime(),
						condition: item.condition || '无'
					}));
					
					that.setData({
						orderList: orders,
						filteredOrderList: that.filterOrders(orders, that.data.currentTabIndex, that.data.searchKeyword),
						isLoading: false
					});
				} else {
					wx.showToast({
						title: '获取订单失败',
						icon: 'none'
					});
					that.setData({ isLoading: false });
				}
			},
			fail(err) {
				console.error('请求失败:', err);
				wx.showToast({
					title: '网络错误',
					icon: 'none'
				});
				that.setData({ isLoading: false });
			}
		});
	},

  /**
   * 根据分类和搜索关键词筛选订单
   */
  filterOrders: function (orders, tabIndex, keyword) {
    let filtered = orders;
    
    // 按分类筛选
    if (tabIndex > 0) {
      filtered = filtered.filter(order => order.status === tabIndex);
    }
    
    // 按关键词筛选
    if (keyword) {
      filtered = filtered.filter(order => 
        order.bookName.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // 按创建时间排序
    return filtered.sort((a, b) => b.createTime - a.createTime);
  },

  /**
   * 处理搜索输入
   */
  onSearchInput: function (e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword,
      filteredOrderList: this.filterOrders(this.data.orderList, this.data.currentTabIndex, keyword)
    });
  },

  /**
   * 清除搜索关键词
   */
  clearSearch: function () {
    this.setData({
      searchKeyword: '',
      filteredOrderList: this.filterOrders(this.data.orderList, this.data.currentTabIndex, '')
    });
  },

  /**
   * 切换分类标签
   */
  switchTab: function (e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (index === this.data.currentTabIndex) return;
    
    this.setData({
      currentTabIndex: index,
      filteredOrderList: this.filterOrders(this.data.orderList, index, this.data.searchKeyword)
    });
  },

  /**
   * 确认取件
   */
  confirmPickup: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取件',
      content: '确认买家已取件吗？',
      success(res) {
        if (res.confirm) {
          // 调用后端API更新订单状态
          wx.request({
            url: 'http://127.0.0.1:3000/api/update-order-status',
            method: 'POST',
            data: {
              orderId: orderId,
              status: 3 // 已取件状态
            },
            success(res) {
              if (res.data.success) {
                wx.showToast({
                  title: '操作成功',
                  icon: 'success'
                });
                // 刷新订单列表
                this.fetchOrderData();
              } else {
                wx.showToast({
                  title: '操作失败',
                  icon: 'none'
                });
              }
            },
            fail(err) {
              console.error('更新状态失败:', err);
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    this.fetchOrderData(() => {
      wx.stopPullDownRefresh();
    });
  }
})