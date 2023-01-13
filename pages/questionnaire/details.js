const app = getApp()
Page({
    data: {
        activeName: 0,
        result:['低风险','中风险','高风险'],
        positionList:['胃','肺','肠','宫颈','乳腺','肝'],
        formData:{}
    },
    onLoad(options) {
        let id = options.id||'c7935bdd864341219b9480d65170e453'
        app.api.recordDetail({id}).then(res=>{
            if(res.code===200){
                this.setData({
                    formData:res.data
                })
            }
        })

        // this.setData({
        // 	result: '低风险',
        // 	qaPos:options.qaPos,
        // 	name,age,gender
        // })
    },
    onChange(event) {
        this.setData({
            activeName: event.detail,
        });
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
})