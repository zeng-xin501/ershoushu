// pages/index/index.js
Page({
  data: {
    tasktext: '',
    userInfo: {
      imageSrc: '/images/person.jpg',
      nickname: '',
      gender: '',
      birthday: '',
      address: '',
      phone: ''
    },
    cataloglist: [
      {cid: 1, cn: 'wallet', cname: '钱包', pic: '/images/wallet.jpg'},
      {cid: 2, cn: 'mylove', cname: '收藏', pic: '/images/mylove.jpg'},
      {cid: 3, cn: 'hadrycl', cname: '卖书', pic: '/images/sell.jpg'},
      {cid: 4, cn: 'feedback', cname: '反馈', pic: '/images/feed.jpg'}
    ],
    buylist: ['待支付', '待发货', '待收货', '已完成', '售后单'],
    selllist: ['待取件', '已取件', '待确认', '已完成', '取回单'],
    findlist: []
  },

  onLoad() {				
		this.loadFirstUserFromDB(); // 新增：从数据库加载第一个用户
		this.setupEventBusListener();
		this.initUserInfo();
	},

  onShow() {
    this.updateUserInfo();
  },

  // 从数据库加载第一个用户
	loadFirstUserFromDB: function() {
		console.log('准备发送请求...');
		wx.request({
			url: 'http://172.20.10.3:3000/api/users/first',
			method: 'GET',
			success: (res) => {
				console.log('请求成功:', res);
				console.log('状态码:', res.statusCode);
				console.log('响应数据:', res.data);
				
				if (res.data && Array.isArray(res.data) && res.data.length > 0) {
					const firstUser = res.data[2];
					console.log('用户数据:', firstUser);
					
					this.setData({
						'userInfo.nickname': firstUser.U_name || '未设置昵称',
						'userInfo.gender': this.getGenderText(firstUser.U_gender),
						'userInfo.address': firstUser.U_address || '未设置地址',
						'userInfo.phone': firstUser.U_phone || '未设置电话'
					});
				}
			},
			fail: (err) => {
				console.error('请求失败:', err);
			}
		});
	},
// 性别转换
getGenderText: function(gender) {
  return gender === 1 ? '男' : gender === 2 ? '女' : '未知';
},

initUserInfo() {
	const app = getApp();
	const storedUserInfo = wx.getStorageSync('userInfo') || {};
	const globalUserInfo = app.globalData.userInfo || {};
	
	// 合并用户信息，优先使用最新的全局数据
	const userInfo = {
		...this.data.userInfo, // 默认值
		...storedUserInfo,
		...globalUserInfo
	};
	
	this.setData({ userInfo });
},

  // 设置事件总线监听
  setupEventBusListener() {
    const app = getApp();
    if (!app.eventBus) {
      app.eventBus = {
        events: {},
        on: function(event, callback) {
          this.events[event] = this.events[event] || [];
          this.events[event].push(callback);
        },
        emit: function(event, data) {
          if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
          }
        }
      };
		}

		app.eventBus.on('userInfoUpdated', (userInfo) => {
      console.log('收到用户信息更新:', userInfo);
      this.setData({ userInfo });
    });
	},

  // 更新用户信息
  updateUserInfo() {
    this.setData({
      userInfo: getApp().globalData.userInfo || wx.getStorageSync('userInfo') || this.data.userInfo
    });
  },

  // 处理任务输入
  dotaskinput(e) {
    const value = e.detail.value
    console.log('文本框的值:', value)
    this.setData({ tasktext: value })
  },

  // 处理分类点击
  doCatalogClick(e) {
    const catalog = e.currentTarget.dataset.ca
    if (!catalog) {
      console.error("未获取到分类数据！")
      return
    }

    console.log('点击的分类:', catalog)
    
    // 使用cn作为路径，如果没有则使用cname
    const pagePath = catalog.cn || catalog.cname
    if (!pagePath) {
      console.error("分类数据中没有有效的路径字段！")
      return
    }

    wx.redirectTo({
      url: `/pages/${pagePath}/${pagePath}`
    })
  },

  // 处理购买点击
  doBuyClick() {
    console.log('购买按钮被点击')
    wx.redirectTo({
      url: '/pages/myOrders/myOrders'
    })
  },

  // 处理销售点击
  doSellClick() {
    console.log('销售按钮被点击')  
    wx.redirectTo({
      url: '/pages/mysell/mysell'
    })
  }
})