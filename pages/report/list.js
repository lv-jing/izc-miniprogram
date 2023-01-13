const app = getApp()

Page({
    data: {
        reportlist: []
    },
    handleGotoDetail(e){
        let data = e.currentTarget.dataset;
        wx.navigateTo({
            url:data.url+"?reportCode="+data.item.reportCode
        })
    },
    onLoad: function (options) {
        let type = options.type
        let phone = wx.getStorageSync('phone')
        app.api.getAreaList({phone}).then(res=>{
            if(res.code===200){
                this.setData({
                    reportlist:res.data
                })
                console.log(res.data.length);
                if(type&&res.data.length===1){
                    wx.navigateTo({
                        url:"/pages/report/detail?reportCode="+res.data[0].reportCode
                    })
                }
            }
        })

    },
    onShow() {

    },

})