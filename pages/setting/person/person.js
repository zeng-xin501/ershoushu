
// pages/setting/person/person.js
Page({
  /**
   * 页面的初始数据
   */
  
    chooseImage() {
      
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        success: (res) => {
          this.setData({ imageSrc: res.tempFiles[0].tempFilePath });
        },
        fail: () => {
          // 选择失败也保持默认图片
          wx.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      });
    },

  data: {
    imageSrc: '/images/photo.jpg' ,
    nickname:' ',
    // 性别选择器数据
    genders: ['男', '女', '保密'],
    genderIndex: 2,  // 默认选择"保密"
    
    // 生日选择器数据
    birthday: '',
    currentDate: '',  // 当前日期，用于限制日期选择范围
    
    // 常居地选择器数据
    region: ['北京市', '北京市', '东城区']
  },
  donameClick() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入昵称',
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({
            nickname: res.content
          })
        }
      }
    })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置当前日期，用于限制日期选择器的结束日期
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    this.setData({
      currentDate: `${year}-${month}-${day}`
    });
    
    // 这里可以添加从服务器获取用户个人资料的逻辑
    // 例如：调用API获取用户信息，然后更新页面数据
  },

  /**
   * 性别选择器变化事件处理函数
   */
  onGenderChange: function(e) {
    this.setData({
      genderIndex: e.detail.value
    });
    
    // 这里可以添加将选择结果保存到服务器的逻辑
    console.log('性别已更改为：', this.data.genders[e.detail.value]);
  },

  /**
   * 生日选择器变化事件处理函数
   */
  onBirthdayChange: function(e) {
    this.setData({
      birthday: e.detail.value
    });
    
    // 这里可以添加将选择结果保存到服务器的逻辑
    console.log('生日已更改为：', e.detail.value);
  },

  /**
   * 常居地选择器变化事件处理函数
   */
  onRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    });
    
    // 这里可以添加将选择结果保存到服务器的逻辑
    console.log('常居地已更改为：', e.detail.value);
  },

  /**
   * 保存个人资料
   */
   // 保存数据
   dosaveClick() {
    const app = getApp();
    
    // 获取当前全局用户信息作为基础
    const currentUserInfo = app.globalData.userInfo || {};
    
    // 只更新被修改的字段
    const updatedInfo = {
      ...currentUserInfo, // 保留原有信息
      imageSrc: this.data.imageSrc || currentUserInfo.imageSrc,
      nickname: this.data.nickname || currentUserInfo.nickname,
      gender: this.data.genders[this.data.genderIndex] || currentUserInfo.gender,
      birthday: this.data.birthday || currentUserInfo.birthday,
      address: this.data.region ? this.data.region.join(' ') : currentUserInfo.address
      // 电话字段不更新，保持原值
    };
    
    // 调用全局方法更新用户信息
    app.updateUserInfo(updatedInfo);
    
    // 显示保存成功提示
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        // 返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
})

