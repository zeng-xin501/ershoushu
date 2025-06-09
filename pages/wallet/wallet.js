Page({
  data: {
    balance: 0.00,
    rechargeAmount: '',
    showSuccessToast: false,
    successMessage: ''
  },

  onLoad() {
    this.loadBalance();
  },

  loadBalance() {
    const savedBalance = wx.getStorageSync('userBalance') || 0.00;
    this.setData({ balance: savedBalance });
  },

  onAmountInput(e) {
    let value = e.detail.value;
    value = value.replace(/[^\d.]/g, '');
    const pointIndex = value.indexOf('.');
    if (pointIndex !== -1 && value.length - pointIndex > 3) {
      value = value.substring(0, pointIndex + 3);
    }
    this.setData({ rechargeAmount: value });
  },

  handleRecharge() {
    if (!this.data.rechargeAmount) {
      wx.showToast({ title: '请输入充值金额', icon: 'none' });
      return;
    }

    const amount = parseFloat(this.data.rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '处理中...', mask: true });

    setTimeout(() => {
      const newBalance = this.data.balance + amount;
      
      this.setData({
        balance: newBalance,
        rechargeAmount: '',
        showSuccessToast: true,
        successMessage: `充值成功！当前余额：¥${newBalance.toFixed(2)}`
      });

      wx.setStorageSync('userBalance', newBalance);
      wx.hideLoading();

      setTimeout(() => {
        this.setData({ showSuccessToast: false });
      }, 3000);
    }, 1500);
  }
});