App({
  // 全局数据
  globalData: {
    userInfo: null, // 初始为null，从缓存加载
    genders: ['男', '女', '未知'] // 性别选项
  },

  // 小程序初始化
  onLaunch() {
    // 1. 从缓存加载用户数据
    this.loadUserInfoFromStorage();
    
    // 2. 初始化事件总线
    this.initEventBus();
  },

  // 从缓存加载用户信息
  loadUserInfoFromStorage() {
    try {
      const cachedUserInfo = wx.getStorageSync('userInfo');
      if (cachedUserInfo) {
        this.globalData.userInfo = cachedUserInfo;
        console.log('从缓存加载用户信息:', cachedUserInfo);
      }
    } catch (error) {
      console.error('读取缓存失败:', error);
    }
  },

  // 初始化事件总线
  initEventBus() {
    this.eventBus = {
      listeners: {},
      // 监听事件
      on: (event, callback) => {
        if (!this.eventBus.listeners[event]) {
          this.eventBus.listeners[event] = [];
        }
        this.eventBus.listeners[event].push(callback);
      },
      // 触发事件
      emit: (event, data) => {
        const callbacks = this.eventBus.listeners[event];
        if (callbacks) {
          callbacks.forEach(cb => {
            try {
              cb(data);
            } catch (e) {
              console.error(`事件处理错误 [${event}]:`, e);
            }
          });
        }
      },
      // 移除监听
      off: (event, callback) => {
        if (this.eventBus.listeners[event]) {
          const index = this.eventBus.listeners[event].indexOf(callback);
          if (index !== -1) {
            this.eventBus.listeners[event].splice(index, 1);
          }
        }
      }
    };
  },

  // 更新用户信息方法（供全局调用）
  updateUserInfo: function(newInfo) {
    // 合并更新用户信息
    this.globalData.userInfo = {
      ...this.globalData.userInfo,
      ...newInfo
    };
    
    // 保存到缓存
    wx.setStorageSync('userInfo', this.globalData.userInfo);
    
    // 通知所有监听者
    this.eventBus.emit('userInfoUpdated', this.globalData.userInfo);
    
    return this.globalData.userInfo;
  }
});