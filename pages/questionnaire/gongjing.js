const app = getApp()
Page({
	data: {
		index: 0,
		curSonIndex: -1,
		curIndex: 0,
		qas: [],
		throttleInitTime: 0,
		qaType: 3,
		qaPos:'宫颈'
	},
	onShow(){
		app.api.getQuestionnaire({position:3}).then(res => {
			if (res.code === 200) {
				this.setData({
					qas: res.data.content
				})
			}
		})
	},
	onLoad(options) {

	},
	//节流
	throttle(fn, delay = 1000) {
		let throttleInitTime = this.data.throttleInitTime
		return () => {
			let now = +new Date();
			if (now - throttleInitTime >= delay) {
				fn.apply(this, arguments)
				this.setData({
					throttleInitTime: now
				})
			}
		}
	},

	//上一题
	to_last_question() {
		let curIndex = this.data.curIndex;
		curIndex--;
		this.setData({
			curIndex
		})
	},

	//下一题
	to_next_question() {
		this.throttle(() => {
			let {
				qas,
				curIndex
			} = this.data;
			if (!qas[curIndex].val) {
				wx.showToast({
					title: '请选择答案！',
					icon: 'none'
				})
				return;
			}
			if (curIndex < (qas.length -1)) {
				curIndex++;
				this.setData({
					curIndex
				})
				return;
			}

			this.saveQuestionnaire();
		}, 600)()
	},

	saveQuestionnaire() {
		let phone = wx.getStorageSync('phone')
		app.api.recordAdd({
			phone,
			qAndA: this.data.qas,
			position: this.data.qaType
		}).then(res => {
			if (res.code === 200) {
				let id = res.data.id
				wx.hideLoading()
				setTimeout(() => {
					wx.redirectTo({
						url: '/pages/questionnaire/result?id=' + id,
					})
				}, 100)
			}
		})
	},
	//select change
	selectValue(e) {
		let {
			val,
		} = e.currentTarget.dataset;
		let curIndex = this.data.curIndex;
		let name = `qas[${curIndex}].val`;
		this.setData({
			[name]: val
		})
	},
	selectSonValueSingle(e) {
		if (!this.data.canEdit) {
			wx.showToast({
				title: '当前状态不能再修改问卷了！',
				icon: 'none'
			})
			return;
		}
		let {
			val,
			index,
			isadd
		} = e.currentTarget.dataset;
		if (isadd) {
			wx.showModal({
				title: '提示',
				content: '这是一个模态弹窗',
				editable: true,
				success: (res) => {
					console.log(res)
					if (res.confirm) {
						console.log('用户点击确定')
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		} else {
			let curIndex = this.data.curIndex;
			let name = `qas[${curIndex}].qas[${index}].val`
			this.setData({
				[name]: val
			})
		}

	},
	input(e){
		const {
			index
		} = e.currentTarget.dataset
		let curIndex = this.data.curIndex;
			let name = `qas[${curIndex}].qas[${index}].val`
			this.setData({
				[name]: e.detail.value
			})
	},
	//select change
	selectSonValue(e) {
		if (!this.data.canEdit) {
			wx.showToast({
				title: '当前状态不能再修改问卷了！',
				icon: 'none'
			})
			return;
		}
		let {
			val,
			idx,
			index,
			isadd,
		} = e.currentTarget.dataset;
		let curIndex = this.data.curIndex;
		let selected = this.data.qas[curIndex].qas[index].options[idx].selected
		if (isadd && (val === '其他')) {
			if (selected) {
				let selectedName = `qas[${curIndex}].qas[${index}].options[${idx}].selected`
				this.setData({
					[selectedName]: selected ? false : true,
				})
			} else {
				wx.showModal({
					title: '提示',
					editable: true,
					placeholderText: '请输入',
					success: (res) => {
						console.log(res)
						if (res.confirm) {
							console.log('用户点击确定')
							if (res.content) {
								let val=res.content;
									if(this.data.qas[curIndex].qas[index].needTime){

									let times=this.data.times;
									wx.showActionSheet({
										itemList: times,
										alertText:'请选择服用时间',
										success: (res)=> {
										  console.log(res.tapIndex)
										  let time=times[res.tapIndex]
										  let timeName=`qas[${curIndex}].qas[${index}].options[${idx}].time`

										  let kayName = `qas[${curIndex}].qas[${index}].options[${idx}].item`
										  let selectedName = `qas[${curIndex}].qas[${index}].options[${idx}].selected`
										  let addName = `qas[${curIndex}].qas[${index}].options[${idx+1}]`
										  this.setData({
											  [kayName]: val,
											  [selectedName]: selected ? false : true,
											  [addName]: {
												  item: '其他',
												  is_add: true
											  },
												[timeName]:time
										  })
											
										}
									  })

								}else{
									let kayName = `qas[${curIndex}].qas[${index}].options[${idx}].item`
									let selectedName = `qas[${curIndex}].qas[${index}].options[${idx}].selected`
									let addName = `qas[${curIndex}].qas[${index}].options[${idx+1}]`
									this.setData({
										[kayName]: val,
										[selectedName]: selected ? false : true,
										[addName]: {
											item: '其他',
											is_add: true
										},
									})
								}
							}
						}
					}
				})
			}
		} else {
			if(!selected && (this.data.qas[curIndex].qas[index].needTime)){
				let times=this.data.times;
				wx.showActionSheet({
					itemList: times,
					alertText:'请选择服用时间',
					success: (res)=> {
					  console.log(res.tapIndex)
					  let time=times[res.tapIndex]
					  let timeName=`qas[${curIndex}].qas[${index}].options[${idx}].time`
					  let name = `qas[${curIndex}].qas[${index}].options[${idx}].selected`
						this.setData({
							[name]: selected ? false : true,
							[timeName]:time
						})
					}
				  })
			}else{
				let name = `qas[${curIndex}].qas[${index}].options[${idx}].selected`
				this.setData({
					[name]: selected ? false : true,
				})
			}
		}
	}
})