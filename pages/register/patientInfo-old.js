const app = getApp()

Page({
	data: {
		genders: ['男', '女'],
		contactRelations: ['夫妻', '父母', '子女', '兄弟姐妹', '朋友'],
		formObj: {
			name: '',
			gender: '',
			address: '',
			hospital_id: '',
			contact_phone: '',
			contact_relation: '',
		}
	},

	onLoad(options) {
		let formObj={}
		if(app.globalData.patientInfo){
			let {
				name,gender,address,hospitalInfoModel,contact_phone,contact_relation
			}=app.globalData.patientInfo
			let {
				hospital_id,
				hospital_name
			}=hospitalInfoModel
			formObj={name,gender,address,hospital_id,hospital_name,contact_phone,contact_relation}
		}
		
		this.setData({
			formObj,
			fromPage: options.fromPage
		})
	},

	// 输入姓名 紧急联系人
	input(e) {
		const {
			field
		} = e.currentTarget.dataset
		this.setData({
			[`formObj.${field}`]: e.detail.value
		})
	},

	// 选择性别
	changeGender(e) {
		this.setData({
			[`formObj.gender`]: this.data.genders[e.detail.value]
		})
	},

	// 选择区域
	tapAddress(e) {
		wx.getLocation({
			type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			success: (res) => {
				const latitude = res.latitude
				const longitude = res.longitude
				wx.chooseLocation({
					latitude,
					longitude,
					success: (res) => {
						this.setData({
							'formObj.address': res.address,
						})
					}
				})
			},
			fail: () => {
				wx.showModal({
					title: '提示',
					content: '您未授权位置信息，将无法使用位置功能！是否开启授权',
					confirmText: '去授权',
					cancelText: '不授权',
					success(res) {
						if (res.confirm) {
							wx.openSetting({})
						}
					}
				})
			}
		})
	},

	// 选择联系人关系
	changeContactRelation(e) {
		this.setData({
			[`formObj.contact_relation`]: this.data.contactRelations[e.detail.value],
		})
	},

	// 去选择医院页、常住地址页
	toNext(e) {
		const url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url
		})
	},

	// 点击提交
	tapSubmit() {
		let res = this.judgeComplete();
		if (res.complete) {
			const {
				name,
				gender,
				address,
				hospital_id,
				contact_phone,
				contact_relation,
			} = this.data.formObj;

			app.api.updatePatientInfo({
				name,
				gender,
				address,
				hospital_id,
				contact_phone,
				contact_relation,
			}).then(async (res) => {
				await app.getPatientInfo()
				if (this.data.fromPage === 'my') {
					wx.hideLoading()
					wx.showToast({
						title: '保存成功！',
						icon: 'none'
					})
					wx.navigateBack({
						delta: 0,
					})
				} else {
					let questionnaire = app.globalData.patientInfo.questionnaireInfoModel
					if (questionnaire) {
						wx.switchTab({
							url: `/pages/home/home`
						})
					} else {
						wx.redirectTo({
							url: `/pages/questionnaire/selectPosition`
						})
					}
				}
			})
		} else {
			wx.showToast({
				title: res.title,
				icon: 'none'
			})
		}
	},

	// 校验 完整性
	judgeComplete() {
		let complete = true;
		let title = '';
		let formObj = this.data.formObj;
		if (!formObj.contact_relation) {
			title = '请选择与本人关系!'
			complete = false;
		};
		if (!/^1[3-9]{1}[0-9]{9}$/.test(formObj.contact_phone)) {
			title = '请输入正确的手机号!'
			complete = false;
		}
		if (!formObj.contact_phone) {
			title = '请输入紧急联系人!'
			complete = false;
		};
		if (!formObj.hospital_id) {
			title = '请选择指定社区康复中心!'
			complete = false;
		};
		if (!formObj.address) {
			title = '请输入常住地址!'
			complete = false;
		};
		if (!formObj.gender) {
			title = '请选择性别!'
			complete = false;
		};
		let idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
		// 判断格式是否正确
		let cardIdOk = idcard_patter.test(formObj.card_id);
		if (!cardIdOk || (formObj.card_id.length !== 18)) {
			title = '请输入合理身份证号!'
			complete = false;
		};
		if (!formObj.card_id) {
			title = '请输入身份证号!'
			complete = false;
		};
		if (!formObj.name) {
			title = '请输入姓名!'
			complete = false;
		};
		return {
			complete,
			title
		};
	},
});