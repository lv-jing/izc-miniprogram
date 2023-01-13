const app = getApp()
Page({
    data: {
        gender: 'women',
        canEdit: true,
        weiStatus: '',
        feiStatus: '',
        changStatus: '',
        ganStatus: '',
        rxStatus: '',
        gjStstus: '',
        positionStatusList: [],
    },

    onLoad(option) {
        let gender = app.globalData.patientInfo.gender
        gender = gender === '男' ? 'men' : 'women'
        this.setData({
            gender
        })
    },

    onShow() {
        let phone = wx.getStorageSync('phone')
        app.api.getStatus({phone}).then(res => {
            if (res.code === 200) {
                let list = res.data.positionStatusList
                this.setData({
                    positionStatusList: res.data.positionStatusList
                })
                this.setData({
                    weiStatus: list[0].status || '',
                    feiStatus: list[1].status || '',
                    changStatus: list[2].status || '',
                    ganStatus: list[5].status || '',
                    rxStatus: list[4].status || '',
                    gjStstus: list[3].status || '',
                })

                console.log(this.data);


            }
        })
    },

    //选择身体部位
    selePost(e) {
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: "/pages/questionnaire/" + type
        })
    }
})