Page({
  data: {
    imageSrc: '',
    rating: 7, // 默认评分为5分
    categories: ['小说', '教材', '儿童读物', '旅行', '自然科学', '戏剧', '健康', '自我提升'],
    categoryIndex: 0 // 默认选择第一个分类
  },
  
  onRatingChange(e) {
    this.setData({
      rating: e.detail.value
    });
  },
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        this.setData({ imageSrc: res.tempFiles[0].tempFilePath });
      }
    });
  },
  onCategoryChange(e) {
    this.setData({
      categoryIndex: e.detail.value
    });
  },

  handleSubmit(e) {
    const { name, condition, price, note } = e.detail.value;
    if (!name || !condition || !price || !note) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    // 收集所有数据
    const bookData = {
      name,
      condition,
      price,
      note,
      rating: this.data.rating,
      category: this.data.categories[this.data.categoryIndex],
      image: this.data.imageSrc,
      submitTime: new Date().toISOString()
    };

    console.log('提交数据:', bookData);

    // 获取现有的回收书籍数据
    let recycleBooks = wx.getStorageSync('recycleBooks') || [];
    
    // 添加新数据
    recycleBooks.push(bookData);
    
    // 保存到本地存储
    wx.setStorageSync('recycleBooks', recycleBooks);

    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 1500
    });

    // 提交成功后返回到sale页面
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 1000);
  },
  
  goBack() {
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 1000);
  }
});