const app = getApp()
Page({
    data: {
        hospitalInfo: {
        },
        datearr: [
        ],
        selDateVal: -1,
        timearr: [
        ],
        selTimeVal: -1
    },
    onLoad(options) {
        const hospital_id = options.id
        //获取医院距离我的位置
        app.api.getHospitalInfo({
            hospital_id
        }).then(async (res) => {
            console.log(res);
            let checkInfo=res.inspection_items[0]
            await this.judgeTime(checkInfo);
            let gapArr = await app.getDistance([res]);
            res.gap = gapArr[0]
            this.setData({
                hospitalInfo: res,
                checkInfo
            })
            wx.hideLoading()
        })
    },
    onShow() {

    },
    async judgeTime(res) {
        let day = app.formatTime('yyyy-MM-dd') + ' 00:00:00';
        let time = +new Date(day) + (24 * 60 * 60 * 1000);
       
        let dates = [];
        let endTime = time + (3 * 24 * 60 * 60 * 1000);
        if (endTime > (+ new Date(res.check_end_time))) {
            endTime =(+ new Date(res.check_end_time))
        }
        let noQuota=true;
        for (let i = 0; i < 3; i++) {
            if ((time + ((i + 1) * 24 * 60 * 60 * 1000)) < (+ new Date(res.check_end_time))) {
                // let quota=await app.api.getOrderQuota();
                let quota=i;
                if(quota) noQuota=false;
                let obj = {
                    quota,
                    startTime: time + (i * 24 * 60 * 60 * 1000),
                    endTime: time + ((i + 1) * 24 * 60 * 60 * 1000),
                }
                obj.time = app.formatTime('yyyy-MM-dd', obj.startTime)
                let maps = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                obj.week = maps[new Date(obj.startTime).getDay()];
                dates.push(obj)
            }
        }
        this.setData({
            dates,
            noQuota
        })
        wx.hideLoading()
    },
   
    //选择时间/日期
    seleDateTime(e) {
        let curindex = e.currentTarget.dataset.index;
        let key = e.currentTarget.dataset.key;
        let quota = e.currentTarget.dataset.quota;
        if (quota == 0) {
            return;
        }
        this.setData({
            [key]: curindex
        })
    },

    //预约检查
    submitInfo() {
        let {
            selDateVal,
            selTimeVal,
            checkInfo,
            hospitalInfo,
            dates
        } = this.data;
        if (selDateVal < 0 || selTimeVal < 0) {
            wx.showToast({
                title: '请选择就诊时间',
                icon: 'none'
            })
            return
        }
        let check_hour = checkInfo.times[selTimeVal];
        let check_date = dates[selDateVal].time;
        app.api.createOrder({
            hospital_id:hospitalInfo.hospital_id,
            check_item:checkInfo.item,
            check_date,
            check_hour,
        }).then((res) => {
            wx.hideLoading()
            wx.showToast({
                title: '提交完成',
                icon: 'none'
            })
            
            setTimeout(()=>{
                wx.navigateTo({
                    url: '/pages/check/createSucc?id=' + res.id,
                })
            },900)
        })
    },
    toHerf() {
        wx.navigateBack({
            delta: 0,
        })
    }
})