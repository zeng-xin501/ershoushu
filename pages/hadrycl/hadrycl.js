// pages/hadrycl/hadrycl.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: []
  },

  /**
   * 加载已提交的书籍数据
   */
  loadBooks() {
    const recycleBooks = wx.getStorageSync('recycleBooks') || [];
    // 按提交时间倒序排序，最新提交的显示在前面
    recycleBooks.sort((a, b) => {
      return new Date(b.submitTime) - new Date(a.submitTime);
    });
    
    this.setData({
      books: recycleBooks
    });
  },

  /**
   * 生命周期函数--监听页面显示
   * 每次显示页面时重新加载数据，确保数据最新
   */
  onShow() {
    this.loadBooks();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadBooks();
    wx.stopPullDownRefresh();
	},
})

