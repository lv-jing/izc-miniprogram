const { default: api } = require("../../services/API");

const app = getApp()

Page({
  data: {

  },
  onLoad(options) {
    let id=options.id;
    app.api.getReportInfo({
      id
    }).then((res)=>{
      console.log(res)
      let endTime = app.formatTime('yyyy-MM-dd', (+new Date(res.updatedAt) + 5 * 24 * 60 * 60 * 1000));
      this.setData({
        endTime,
        testing_code:res.testing_code,result_pic:res.result_pic
      })
      wx.hideLoading()
    })
   
  },
  onShow() {

  },
  toHome() {}

})