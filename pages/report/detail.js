const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeName: 'a',
        summarize: '',
        formData: {},
        reportCode: ''
    },

    onChange(event) {
        this.setData({
            activeName: event.detail,
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            reportCode: options.reportCode || ''
        })
        app.api.getAreaDetail({
            reportCode: options.reportCode
        }).then(res => {
            if (res.code === 200) {
                this.setData({
                    formData: res.data
                })
            }
        })
    },
    topPoper(even) {
        let item = even.currentTarget.dataset.item
        let title = item.referenceValue
        let unit = item.unit || ''
        wx.showToast({
            title: title + unit,
            icon: 'none'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },
    toDown() {
        let token = wx.getStorageSync('token')
        wx.showLoading({
            title: '加载中',
        })
        wx.downloadFile({
            url: app.globalData.baseUrl + '/examReport/export?reportCode=' + this.data.reportCode, //仅为示例，并非真实的资源
            header: {
                Authorization: token ? 'Bearer' + ' ' + token : null
            },
            success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    wx.openDocument({
                        filePath: res.tempFilePath,
                        showMenu: true,
                        fileType: 'pdf',
                        success: function (res) {
                            wx.hideLoading()
                        }
                    })
                }
            }
        })
    }
})