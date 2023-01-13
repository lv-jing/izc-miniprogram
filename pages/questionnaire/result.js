const app = getApp()
Page({
	data: {
		result:['低风险人群','中风险人群','高风险人群'],
		positionList:['胃','肺','肠','宫颈','乳腺','肝'],
		formData:{}
	},
	onLoad(options) {
		let id = options.id
		let {name,age,gender}= app.globalData.patientInfo;
		this.setData({
			name,age,gender
		})
		app.api.recordDetail({id}).then(res=>{
			if(res.code===200){
				this.setData({
					formData:res.data
				})
			}
		})
	},
	onShow() {

	},

	toHref(e) {
		let url = e.currentTarget.dataset.url;
		if (url.indexOf('home') > -1) {
			wx.switchTab({
				url
			})
		} else {
			wx.navigateTo({
				url
			})
		}
	},
})