const app = getApp()

Page({
    data: {
        genders: ['男', '女'],
        contactRelations: ['夫妻', '父母', '子女', '兄弟姐妹', '朋友', '其他'],
        formObj: {
            name: '',
            gender: '',
            birthday: "",
            birth_address: '',
            hospital_name: '',
            contact_phone: '',
            contact_relation: '',
        },
        endData: '2021-12-31'
    },

    onLoad(options) {
        let formObj = {}
        console.log(app.globalData.patientInfo, 999);
        if (app.globalData.patientInfo) {
            let {
                id,
                name, // 姓名
                gender, // 性别
                birthday, // 生日
                address, // 常住地址
                hospitalId, // 我的康复医院id
                hospitalName, // 我的康复医院名称
                emergencyContact, // 紧急联系人
                emergencyRelation, // 与本人关系
            } = app.globalData.patientInfo

            formObj = {
                id,
                name, // 姓名
                gender, // 性别
                birthday, // 生日
                address, // 常住地址
                hospitalId, // 我的康复医院id
                hospitalName, // 我的康复医院名称
                emergencyContact, // 紧急联系人
                emergencyRelation, // 与本人关系
            }
        }

        this.setData({
            formObj
        })
    },
    onShow() {

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
        let type = e.currentTarget.dataset.type;
        let name = 'formObj.' + type
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
                            [name]: res.address,
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
    changeBirthday(e) {
        this.setData({
            'formObj.birthday': e.detail.value
        })
    },
    // 选择联系人关系
    changeContactRelation(e) {
        console.log(e);
        console.log(this.data.formObj);
        this.setData({
            [`formObj.emergencyRelation`]: this.data.contactRelations[e.detail.value],
        })
    },

    // 去选择医院页、常住地址页
    toNext(e) {
        // 去选择医院页、常住地址页
        const url = e.currentTarget.dataset.url;
        app.getLocation().then((res) => {
            const latitude = res.latitude
            const longitude = res.longitude
            wx.chooseLocation({
                latitude,
                longitude,
                success: (res) => {
                    this.setData({
                        area: res.address,
                    })
                    wx.navigateTo({
                        url: url + '?area=' + res.address
                    })
                }
            })
        })
    },

    // 点击提交
    tapSubmit() {
        app.api.putInfo({
            ...this.data.formObj
        }).then(res => {
            if (res.code === 200) {
                wx.hideLoading()
                wx.showToast({
                    title: '保存成功！',
                    icon: 'none'
                })
                wx.redirectTo({
                    url: `/pages/register/registerSucc`
                })
            }
        })
    },
    showTitle(title) {
        wx.showToast({
            title,
            icon: 'none'
        })
    },
    // 校验 完整性
    judgeComplete() {
        let title = '';
        let formObj = this.data.formObj;
        if (!formObj.name) {
            title = '请输入姓名!'
            this.showTitle(title)
            return
        }
        if (!(/^[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d·s]{2,50}$/.test(formObj.name))) {
            title = '请输入正确的姓名!'
            this.showTitle(title)
            return
        }
        if (!formObj.gender) {
            title = '请选择性别!'
            this.showTitle(title)
            return
        }
        if (!formObj.birthday) {
            title = '请选择出生年月日!'
            this.showTitle(title)
            return
        }
        if (formObj.emergencyContact && !(/^[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d·s]{2,50}$/.test(formObj.emergencyContact))) {
            title = '请输入正确联系人!'
            this.showTitle(title)
            return
        }
        this.tapSubmit()
    },
});