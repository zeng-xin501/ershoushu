Page({
  data: {
    addressList: [
      {
        id: 1,
        name: '张三',
        phone: '13800138000',
        province: '天津市',
        city: '天津市',
        district: '和平区',
        detail: '南京路100号',
        isDefault: true
      },
      {
        id: 2,
        name: '李四',
        phone: '13900139000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '建国路88号',
        isDefault: false
      }
    ],
    showModal: false,
    isEdit: false,
    currentAddress: {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    },
    editIndex: -1
  },

  // 添加新地址
  addNewAddress() {
    this.setData({
      showModal: true,
      isEdit: false,
      currentAddress: {
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: false
      },
      editIndex: -1
    })
  },

  // 编辑地址
  editAddress(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      showModal: true,
      isEdit: true,
      currentAddress: JSON.parse(JSON.stringify(this.data.addressList[index])),
      editIndex: index
    })
  },

  // 删除地址
  deleteAddress(e) {
    const index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          const addressList = this.data.addressList
          addressList.splice(index, 1)
          this.setData({ addressList })
          wx.showToast({ title: '删除成功' })
        }
      }
    })
  },

  // 设为默认地址
  setDefault(e) {
    const index = e.currentTarget.dataset.index
    const addressList = this.data.addressList.map((item, i) => {
      return {
        ...item,
        isDefault: i === index
      }
    })
    this.setData({ addressList })
    wx.showToast({ title: '设置成功' })
  },

  // 关闭弹窗
  closeModal() {
    this.setData({ showModal: false })
  },

  // 表单输入处理
  inputName(e) {
    this.setData({
      'currentAddress.name': e.detail.value
    })
  },

  inputPhone(e) {
    this.setData({
      'currentAddress.phone': e.detail.value
    })
  },

  inputDetail(e) {
    this.setData({
      'currentAddress.detail': e.detail.value
    })
  },

  // 地区选择
  regionChange(e) {
    const [province, city, district] = e.detail.value
    this.setData({
      'currentAddress.province': province,
      'currentAddress.city': city,
      'currentAddress.district': district
    })
  },

  // 切换默认地址
  toggleDefault() {
    this.setData({
      'currentAddress.isDefault': !this.data.currentAddress.isDefault
    })
  },

  // 保存地址
  saveAddress() {
    const { name, phone, province, city, district, detail } = this.data.currentAddress
    
    if (!name || !phone || !province || !city || !district || !detail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    
    const addressList = this.data.addressList
    const newAddress = {
      ...this.data.currentAddress,
      id: this.data.isEdit ? this.data.currentAddress.id : Date.now()
    }
    
    if (this.data.isEdit) {
      addressList[this.data.editIndex] = newAddress
    } else {
      addressList.push(newAddress)
    }
    
    // 如果设置为默认，其他地址取消默认
    if (newAddress.isDefault) {
      addressList.forEach(item => {
        if (item.id !== newAddress.id) {
          item.isDefault = false
        }
      })
    }
    
    this.setData({
      addressList,
      showModal: false
    })
    
    wx.showToast({ title: '保存成功' })
  }
})