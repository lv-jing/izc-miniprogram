const app = getApp()

Page({
  data: {
    orderKey: {
      code: '订单编码',
      hospital: '就诊医院',
      date: '就诊日期',
      time: '就诊时间',
      name: '就诊患者',
    },
    orderInfo: {
      code: 'AWD21321321321321',
      hospital: '北京大学医院',
      date: '2021-10-10 周五',
      time: '9:00-9:30',
      name: '王先生',
    }
  },
  onLoad(options) {
    let id=JSON.parse(options.id);
    // let {name,gender}=app.globalData.patientInfo
    // this.setData({
    //   name,gender
    // })

    app.api.getOrderInfo({
      id,
    }).then(async (res) => {
      let maps = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      res.week = maps[new Date(res.check_date).getDay()];
      let hospitalInfo=await app.api.getHospitalInfo({hospital_id:res.hospital_id})
      this.setData({
        checkInfo: res,
        hospital_name:hospitalInfo.hospital_name
      })
      wx.hideLoading();
    })
  },
  onShow() {

  }

})