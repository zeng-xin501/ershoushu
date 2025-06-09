

Page({
  data: {
    inputValue: ''
  },
  
  // 输入框内容变化时更新数据
  inputChange: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  
  // 提交表单
  submitForm: function() {
    const inputValue = this.data.inputValue.trim();
    
    // 验证输入是否为空
    if (!inputValue) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    // 验证输入长度
    if (inputValue.length > 100) {
      wx.showToast({
        title: '内容不能超过100字',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    // 直接显示成功提示
    wx.showToast({
      title: '感谢您的反馈',  
      icon: 'success',
      duration: 2000,
      success: () => {
          // 清空输入框
          this.setData({ inputValue: ''});
          
          // 打印提交内容
          console.log('用户提交的内容:', inputValue);
      }
      
    });
  }
  
});

