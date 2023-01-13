const app = getApp()

Page({
    data: {
        genders: ['男', '女'],
        contactRelations: ['夫妻', '父母', '子女', '兄弟姐妹', '朋友'],
        formObj: {
            report: [{
                name: "郑璐瑶体检报告.pdf",
                size: 25687,
                time: 1648451099,
                type: "file",
                url: "http://tmp/JMWCcGNUjHNHa2d56810d66d14152ddd2dfaf968348b.pdf"
            }]
        },
        endData: '2021-12-31'

    },

    onLoad(options) {
        let formObj = {
            report: []
        }
        if (app.globalData.patientInfo) {
            let {
                id,
                name, // 姓名
                gender, // 性别
                phone,
                birthday, // 生日
                height, // 身高
                weight, // 体重
                address, // 常住地址
                hospitalId, // 我的康复医院id
                hospitalName, // 我的康复医院名称
                emergencyContact, // 紧急联系人
                emergencyPhone, // 紧急联电话
                emergencyRelation, // 与本人关系,
                report
            } = app.globalData.patientInfo

            formObj = {
                id,
                name, // 姓名
                gender, // 性别
                phone, // 手机号
                birthday, // 生日
                height, // 身高
                weight, // 体重
                address, // 常住地址
                hospitalId, // 我的康复医院id
                hospitalName, // 我的康复医院名称
                emergencyContact, // 紧急联系人
                emergencyPhone, // 紧急联电话
                emergencyRelation, // 与本人关系
                report: report || []
            }
        }

        this.setData({
            formObj
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
        this.setData({
            [`formObj.emergencyRelation`]: this.data.contactRelations[e.detail.value],
        })
    },

    // 去选择医院页、常住地址页
    toNext(e) {
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
        }).then(async (res) => {
            await app.getPatientInfo()
            wx.hideLoading()
            wx.showToast({
                title: '保存成功！',
                icon: 'none'
            })
            wx.navigateBack({
                delta: 0,
            })
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
        let regNum = /^[0-9]*$/
        let regNums = /^[0-9]\d{0,2}(\.\d{1})?$|^0(\.\d{1})?$/
        let title = '';
        let formObj = this.data.formObj;
        if (!formObj.name) {
            title = '请输入姓名!'
            this.showTitle(title)
            return
        }
        if (!(/^[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(formObj.name))) {
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
        if (formObj.height && !regNum.test(formObj.height)) {
            title = '身高只能输入数字!'
            this.showTitle(title)
            return
        }
        if (formObj.weight && !regNums.test(formObj.weight)) {
            title = '体重最多输入3位整数,可保留一位小数!'
            this.showTitle(title)
            return
        }

        if (formObj.emergencyContact && !(/^[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d·s]{2,50}$/.test(formObj.emergencyContact))) {
            title = '请输入正确的联系人!'
            this.showTitle(title)
            return
        }
        if (formObj.emergencyPhone && !(/^1[3|4|5|7|8][0-9]{9}$/.test(formObj.emergencyPhone))) {
            title = '请输入正确的紧急联系人电话!'
            this.showTitle(title)
            return
        }
        // if (!formObj.contact_relation) {
        // 	title = '请选择与本人关系!'
        // 	complete = false;
        // };
        // if (!/^1[3-9]{1}[0-9]{9}$/.test(formObj.contact_phone)) {
        // 	title = '请输入正确的手机号!'
        // 	complete = false;
        // }
        // if (!formObj.contact_phone) {
        // 	title = '请输入紧急联系人电话!'
        // 	complete = false;
        // };
        // if (!formObj.hospital_id) {
        // 	title = '请选择指定社区康复中心!'
        // 	complete = false;
        // };
        this.tapSubmit()
    },
    bindDelete(event) {
        const {index} = event.detail;
        let file = this.data.formObj.report
        file.splice(index, 1)
        this.setData({
            [`formObj.report`]: file
        })
    },
    oversize() {
        this.showTitle('单张图片或文件最大为20M')
    },
    afterRead(event) {
        wx.showLoading({
            title: '上传中...'
        })
        const {file} = event.detail //获取所需要上传的文件列表
        console.log(file);
        for (let i = 0; i < file.length; i++) {
            if (file[i].name.split('.')[1] === 'pdf' || file[i].name.split('.')[1] === 'png' || file[i].name.split('.')[1] === 'jpg' || file[i].name.split('.')[1] === 'jpeg') {
            } else {
                wx.hideLoading()
                wx.showToast({
                    title: '上传格式为pdf/png/jpg/jpeg！',
                    icon: 'none',
                })
                return;
            }
        }
        let uploadPromiseTask = [] //定义上传的promise任务栈
        for (let i = 0; i < file.length; i++) {
            uploadPromiseTask.push(this.uploadFile(file[i].url,file[i].name)) //push进每一张所需要的上传的图片promise栈
        }
        Promise.all(uploadPromiseTask).then(res => {
            //全部上传完毕
            this.setData({
                [`formObj.report`]: this.data.formObj.report.concat(res)
            })
            wx.hideLoading()
        }).catch(error => {
            //存在有上传失败的文件
            wx.hideLoading()
            wx.showToast({
                title: '上传失败！',
                icon: 'none',
            })
        })
    },
    uploadFile(uploadFile,name) {
        console.log(name);
        let token = wx.getStorageSync('token');
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: app.globalData.baseUrl + '/cancerScreeningReport/uploadCancerReport?name='+name, // 上传的服务器接口地址
                header: {Authorization: token ? 'Bearer' + ' ' + token : null},
                filePath: uploadFile,
                name: 'uploadFile', //上传的所需字段，后端提供
                success: (res) => {
                    // // 上传完成操作
                    const data = JSON.parse(res.data)
                    const url = data.data[0].url
                    const key = data.data[0].key
                    const name = data.data[0].name
                    resolve({
                        url,
                        key,
                        name
                    })
                },
                fail: (err) => {
                    console.log(err, 7);
                    //上传失败：修改pedding为reject
                    reject(err)
                }
            });
        })
    },
    preview(event){
        if(event.detail.key.split('.')[1]==='pdf'){
            wx.downloadFile({
                // 示例 url，并非真实存在
                url: event.detail.url,
                success: function (res) {
                    const filePath = res.tempFilePath
                    wx.openDocument({
                        filePath: filePath,
                        success: function (res) {
                            console.log('打开文档成功')
                        }
                    })
                }
            })
        }
    }
});