// index.js
const app = getApp();
Page({
	data: {
    bannerlist:[
      '/images/banner11.jpg',
      '/images/banner12.jpg',
      '/images/banner13.jpg',
      '/images/banner14.jpg'
		],
		seachertext:'',
		filteredList:[],
		isSearching: false,
		product:null,
		relatedProducts:[],
    recommendList: []
	},
	onLoad() {
    wx.request({
        method: 'GET',
        url: 'http://172.20.10.3:3000/getUser',
        data: {},
        success: (res) => {
            console.log('接口返回数据:', res);
            if (res.statusCode === 200 && res.data) {
                // 处理数据：添加图片路径
                const rawData = Array.isArray(res.data) ? res.data : 
                              (Array.isArray(res.data.data) ? res.data.data : [])
                              
                const goodsList = rawData.map(item => ({
										...item,
										id: item.B_ID || item.id,
                    image: `/images/${item.B_ID}.jpg`,  // 动态生成路径
                    name: item.B_name || item.name,  // 统一字段名
                    price: item.B_price || item.price
                }));
                
                console.log('处理后的数据:', goodsList);
                
                // 更新数据
                this.setData({
                    recommendList: goodsList,
                    displayList: goodsList
                });
                
                // 过滤已售出商品
                const soldItems = wx.getStorageSync('soldItems') || [];
                this.setData({
                    displayList: goodsList.filter(item => !soldItems.includes(item.id))
                });
                
                // 缓存数据
                wx.setStorageSync('recommendList', goodsList);
            }
        },
        fail: (err) => {
            console.error("请求失败:", err);
            // 使用缓存数据
            const cached = wx.getStorageSync('recommendList') || [];
            this.setData({
                recommendList: cached,
                displayList: cached
            });
        }
    });
},
doseacherinput: function(e) {
	const keyword = e.detail.value.trim().toLowerCase();
	this.setData({ seachertext: e.detail.value });

	if (!keyword) {
			this.setData({
					filteredList: [],
					isSearching: false
			});
			return;
	}

	const searchFields = ['B_name', 'name', 'B_description', 'author', 'B_press', 'press'];
	const filtered = this.data.recommendList.filter(item => {
			return searchFields.some(field => 
					item[field] && String(item[field]).toLowerCase().includes(keyword))
	});

	this.setData({
			filteredList: filtered,
			isSearching: true
	});
},
	//清空搜索
	clearSearch:function(){
		this.setData({
			seachertext:'',
			filteredList:[],
			isSearching:false
		});
	},
	//查看详细按钮的点击事件
  doshowDetail:function(e){
    let that=this;
    console.log('detail按钮被点击', e)
//获取整个商品对象，从页面使用data-product传递的参数信息   
  let pd=e.currentTarget.dataset.product
  console.log('index--pd====>',pd)
//将pd对象转为url参数形式(pname=xxx&price=xxx&....)
  pd=JSON.stringify(pd);//将json对象转化为json格式的字符串
  console.log('stringify-pd====>',pd)
  //将json字符串转为url参数形式
  pd=encodeURIComponent(pd);
  console.log("index-pd===转换为url后->",pd)
  wx.redirectTo({
    url: '/pages/detail/detail?product='+pd
  })
},
	doselect:function(){
		wx.navigateTo({
			url: '/pages/category/category'
		})
	}
})

