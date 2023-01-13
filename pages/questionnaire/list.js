const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reportlist: [],
        result: ['低风险人群', '中风险人群', '高风险人群'],
        positionList: ['胃', '肺', '肠', '宫颈', '乳腺', '肝'],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let phone = wx.getStorageSync('phone')
        app.api.recordList({phone}).then(res => {
            if (res.code === 200) {
                this.setData({
                    reportlist: res.rows
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },
    handleGotoDetail(e) {
        let data = e.currentTarget.dataset;
        wx.navigateTo({
            url: data.url + "?id=" + data.item.id
        })
    },
    goto(e) {
        let url = e.currentTarget.dataset.url;
        let type = e.currentTarget.dataset.type||'';
        wx.navigateTo({
            url:url+'?type='+type
        })
    }
})