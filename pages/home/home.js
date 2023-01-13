const app = getApp()
const qqmapsdk = app.globalData.qqmapsdk;

Page({
    data: {
        reagentCode: '',
        loading: true, //等数据加载完成后出现页面
        weather: {},
        statusList:[],
        positionList:['胃癌','肺癌','肠癌','肝癌'],
        positionWomenList:['胃癌','肺癌','肠癌','宫颈癌','乳腺癌','肝癌'],
        result:['低风险','中风险','高风险'],
    },
    onShow() {
        let openid = wx.getStorageSync('openid')
        let token = wx.getStorageSync('token')
        let phone = wx.getStorageSync('phone')
        if (!openid) {
            app.getOpenId()
        }
        if (openid && token && phone) {
            this.getPatientInfo()
        } else {
            wx.redirectTo({
                url: '/pages/register/login',
            })
        }
    },
    //获取各种数据
    async getPatientInfo() {
        await app.getPatientInfo();
        let res = app.globalData.patientInfo;
        if (res.name) {
            let noImgNumber = null;
            let noReadLength = 0;
            let canScan = true;
            let {name, age, gender} = res;
            this.setData({
                noImgNumber,
                canScan,
                noReadLength,
                name, age, gender,
            })
            this.getStatus(gender)
            wx.hideLoading()
            this.getLocation();
        }
    },

    getStatus(gender) {
        let phone = wx.getStorageSync('phone')
        app.api.getStatus({phone}).then(res => {
            if (res.code === 200) {
                let list = res.data.positionStatusList
                let data = []
                for (var i in list){
                    if(gender==='男'){
                        if(i!=='3'&&i!=='4'){
                            data.push(list[i])
                        }
                    } else {
                        data.push(list[i])
                    }
                }
                this.setData({
                    statusList: data
                })
            }
        })
    },

    //获取我的地址坐标
    async getLocation() {
        try {
            let loca_res = await app.getLocation()
            this.getWeather(loca_res);
            // this.getDistance();
        } catch (error) {
            console.error('用户拒绝授权., 获取位置信息失败', error)
        }
    },

    //获取当前位置具体医院的距离
    async getDistance() {
        let {latitude, longitude} = this.data
        let gapArr = await app.getDistance([{
            latitude,
            longitude
        }])
        this.setData({
            distance: gapArr[0]
        })
    },

    //获取天气
    getWeather(location) {
        qqmapsdk.reverseGeocoder({ //SDK调用
            location,
            sig: 'jzQTXPZc23sS03OoWMc4nvsem9nIwhvr',
            success: (res) => {
                res = res.result.address_component;
                wx.request({
                    url: 'https://wis.qq.com/weather/common',
                    data: {
                        source: 'pc',
                        weather_type: 'observe',
                        province: res.province,
                        city: res.city,
                        county: res.district
                    },
                    method: 'get',
                    success: (subres) => {
                        let weather_res = subres.data.data.observe;
                        weather_res.city = res.city
                        this.setData({
                            weather: weather_res
                        })
                    },
                    fail: function (fail) {
                        console.log(fail);
                    }
                })
            }
        })
    },

    toHref(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url
        })
    },

    showToast(e) {
        let title = e.currentTarget.dataset.title;
        wx.showToast({
            title,
            icon: 'none'
        })
    }
})