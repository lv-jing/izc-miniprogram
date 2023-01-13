const app = getApp()

Page({
  data: {
    hospitalList: []
  },
  onLoad(options) {
    let id=options.id;
    let {name,gender}=app.globalData.patientInfo
    app.api.getReportInfo({
      id
    }).then((res)=>{
      this.setData({
      testKit:res,
      name,gender
    })
       //获取医院距离我的位置
    app.api.getHospitalList({
      offset:0,count:10
    }).then((res) => {
      let list=res.list.slice(0, 2)
      this.getHospitalDistance(list);
    })
    })
 
  },
  onShow() {

  },
  toHref(e) {
    let {
      id,
      url
    } = e.currentTarget.dataset;
    if (id) {
      wx.navigateTo({
        url: '/pages/check/create?id=' + id
      })
    }
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  //获取我离医院的距离
  async getHospitalDistance(hospitalList) {
    let gapArr = await app.getDistance(hospitalList)
    gapArr.map((item, index) => {
      hospitalList[index].gap = item
    })
    this.setData({
      hospitalList
    })
    wx.hideLoading();
  },
  getProposalText() {
    wx.showLoading({
      title: '加载中...',
    })
    app.db.collection('richText').where({
        type: 'proposal'
      })
      .get().then(res => {
        res = res.data;
        this.setData({
          text: res[0].text
        })
        wx.hideLoading()
      })
  },
})