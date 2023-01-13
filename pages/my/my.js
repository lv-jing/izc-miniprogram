import api from "../../services/API";

const app = getApp()

Page({
    data: {
        userInfo: {},
        show: false,
        setPhone:''
    },
    onLoad() {

    },
    onShow() {
        let {gender, name, phone,avatar} = app.globalData.patientInfo
        this.setPhone(phone)
        this.setData({
            gender, name, phone,avatar,
            setPhone: this.setPhone(phone)
        })
    },
    toHref(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url
        })
    },
    toLogin() {
        this.setData({
            show: true
        })
    },
    onClose() {
        this.setData({
            show: false
        })
    },
    onConfirm(e) {
        let token = wx.getStorageSync('token')
        let url = e.currentTarget.dataset.url;
        this.setData({
            show: false
        })
        app.api.logout({token}).then(res=>{
            if(res.code===200){
                wx.clearStorageSync()
                wx.redirectTo({
                    url
                })
            }
        })

    },
    setPhone(tel){
        var reg = /^(\d{3})\d{4}(\d{4})$/;
        tel = tel.replace(reg, "$1****$2");
        return tel
    },
    // 本地照片上传
    handleChooseAlbum() {
        let token = wx.getStorageSync('token');
        //系统API，让用户在相册中选择图片（或者拍照）
        wx.chooseImage({
            success: (res) => {
                wx.showLoading({
                    title: '上传中...'
                })
                //1、取出路径
                const path = res.tempFilePaths[0]
                console.log(res);
                wx.uploadFile({
                    url: app.globalData.baseUrl + '/cancerScreeningReport/uploadCancerReport?name=tx.png', // 上传的服务器接口地址
                    header:{Authorization: token ? 'Bearer' + ' ' + token : null},
                    filePath: path,
                    name: 'uploadFile', //上传的所需字段，后端提供
                    success: (res) => {
                        console.log(res);
                        // // 上传完成操作
                        const data = JSON.parse(res.data)
                        const url = data.data[0].url
                        const key = data.data[0].key
                        let { phone} = app.globalData.patientInfo
                        api.changeAvatar({phone, avatar: url}).then(res=>{

                            if(res.code===200){
                                //2、设置imagePath
                                this.setData({
                                    avatar: url
                                })
                            }
                        })
                        wx.hideLoading()
                    },
                    fail: (err) => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '上传失败！',
                            icon: 'none',
                        })
                        //上传失败：修改pedding为reject
                        reject(err)
                    }
                });

            }
        })
    },

})