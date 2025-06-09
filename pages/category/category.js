// 缓存相关常量
const CACHE_PREFIX = 'BOOK_CATEGORY_';
const CACHE_EXPIRE_TIME = 5 * 60 * 1000; // 5分钟缓存过期

Page({
  data: {
    isLoading: false,
    categories: [],
    currentCategory: '0', // 默认选中"全部"分类，使用字符串"0"
    currentCategoryName: '全部',
    books: [],
    originalBooks: []
  },

  onLoad: async function() {
    try {
      // 获取图书分类
      const classesRes = await new Promise((resolve, reject) => {
        wx.request({
          url: 'http://172.20.10.3:3000/api/book-classes',
          method: 'GET',
          success: resolve,
          fail: reject
        });
      });

      console.log('分类API响应:', classesRes);

      if (!classesRes.data || !Array.isArray(classesRes.data)) {
        throw new Error('分类数据格式不正确');
      }

      // 添加"全部"分类，确保ID为字符串"0"以保持类型一致
      const categories = [{ id: "0", name: "全部" }].concat(
        classesRes.data.map(item => ({
          id: item.B_class_id.toString(), // 确保转为字符串
          name: item.B_class_name
        }))
      );

      // 获取图书数据
      const books = wx.getStorageSync('recommendList') || [];
      const soldItems = wx.getStorageSync('soldItems') || [];
      const availableBooks = books.filter(book => !soldItems.includes(book.B_ID));

      this.setData({
        books: availableBooks,
        originalBooks: availableBooks,
        categories: categories
      });

    } catch (error) {
      console.error('加载数据失败:', error);
      wx.showToast({
        title: '加载数据失败: ' + error.message,
        icon: 'none',
        duration: 3000
      });
    }
  },

  // 切换分类
  switchCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id;
    const categoryName = e.currentTarget.dataset.name;

    this.setData({
      currentCategory: categoryId,
      currentCategoryName: categoryName
    });
    this.filterBooks();
  },
  
  // 根据当前分类过滤图书
  filterBooks: function() {
    const categoryId = this.data.currentCategory;
    let filteredBooks = this.data.originalBooks;

    if (categoryId !== "0") {  // "0"表示"全部"分类
      filteredBooks = filteredBooks.filter(book => 
        book.B_class_id === categoryId
      );
    }
    
    this.setData({ books: filteredBooks });
  },

  // 查看图书详情
  gotoDetail: function(e) {
    const book = e.currentTarget.dataset.book;
    wx.navigateTo({
      url: `/pages/detail/detail?product=${encodeURIComponent(JSON.stringify(book))}`
    });
  },

  // 检查缓存
  checkCache: function(categoryId) {
    const cacheKey = `${CACHE_PREFIX}${categoryId}`;
    const cacheData = wx.getStorageSync(cacheKey);
    
    if (cacheData) {
      const now = new Date().getTime();
      if (now - cacheData.timestamp < CACHE_EXPIRE_TIME) {
        return cacheData.books;
      }
      wx.removeStorageSync(cacheKey);
    }
    return null;
  },

  // 设置缓存
  setCache: function(categoryId, books) {
    const cacheKey = `${CACHE_PREFIX}${categoryId}`;
    wx.setStorageSync(cacheKey, {
      books: books,
      timestamp: new Date().getTime()
    });
  },

  // 按分类加载图书
  loadBooksByCategory: async function(categoryId) {
    const cachedBooks = this.checkCache(categoryId);
    if (cachedBooks) {
      this.setData({ books: cachedBooks });
      return;
    }

    this.setData({ isLoading: true });

    try {
      const books = await this.fetchBooksByCategory(categoryId);
      this.setData({ books });
      this.setCache(categoryId, books);
    } catch (error) {
      console.error('加载图书失败:', error);
      wx.showToast({
        title: '加载图书失败，请稍后重试',
        icon: 'none'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 下拉刷新
  onPullDownRefresh: async function() {
    const categoryId = this.data.currentCategory;
    const cacheKey = `${CACHE_PREFIX}${categoryId}`;
    wx.removeStorageSync(cacheKey);
    
    await this.loadBooksByCategory(categoryId);
    wx.stopPullDownRefresh();
  },

  // 查看详细按钮的点击事件
  doshowDetail: function(e) {
    let that = this;
    console.log('detail按钮被点击', e);
    // 获取整个商品对象
    let pd = e.currentTarget.dataset.product;
    console.log('index--pd====>', pd);
    // 将对象转为JSON字符串
    pd = JSON.stringify(pd);
    console.log('stringify-pd====>', pd);
    // 编码URI组件
    pd = encodeURIComponent(pd);
    console.log("index-pd===转换为url后->", pd);
    wx.redirectTo({
      url: '/pages/detail/detail?product=' + pd
    });
  }
});