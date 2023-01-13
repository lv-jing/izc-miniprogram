const app = getApp()
Page({
    data: {
        hospitalList: [],
        area:''
    },
    onLoad(options) {
        this.data.area = options.area;
        app.api.getArea({area: options.area}).then(res => {
            this.setData({
                hospitalList: res.rows
            })
        })
    },
    //选择医院
    seleHospital(e) {
        let hospital_id = e.currentTarget.dataset.id;
        let hospital_name = e.currentTarget.dataset.name;
        let pages = getCurrentPages(); // 当前页，
        let prevPage = pages[pages.length - 2]; // 上一页
        prevPage.setData({
            'formObj.hospitalId': hospital_id,
            'formObj.hospitalName': hospital_name,
        })
        wx.navigateBack({
            delta: 0,
        })
    }
})