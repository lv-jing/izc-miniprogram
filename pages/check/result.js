const app = getApp()

Page({
  data: {
    hospitalList: [],
    states: [
      '预约检查', '到院检查', '检查报告'
    ],
    curState: 0,
  },
  onLoad(options) {
    let {name,gender}=app.globalData.patientInfo
    this.setData({
      name,gender
    })
    app.api.getOrderInfo({
     id: options.id,
    }).then(async (res) => {
      res.time = app.formatTime('yyyy-MM-dd hh:mm:ss', res.addTime);
      let time = +new Date();
      let curState = 0;
      if (time > +new Date(res.check_date)) {
        curState = 1;
      }
      if (res.fileID) {
        curState = 2;
      }
      let gapArr = await app.getDistance([res.hospitalInfoModel]);
      res.gap = gapArr[0]
      this.setData({
        distance: res.gap,
        checkInfo: res,
        curState
      })
      wx.hideLoading();
    })
  },
  getHospital(hosId) {
    app.db.collection('hospital').where({
      hosId,
    }).get().then(async (res) => {
      res = res.data[0];
      let gapArr = await app.getDistance([res]);
      res.gap = gapArr[0]
      this.setData({
        hospitalInfo: res,
      })
      wx.hideLoading()
    })
  },
  onShow() {

  },
  toHome() {},
  	//获取当前位置具体医院的距离
	async getDistance() {
		let {latitude,longitude}=this.data
		let gapArr = await app.getDistance([{
			latitude,
			longitude
		}])
		this.setData({
			distance: gapArr[0]
		})
	},

})