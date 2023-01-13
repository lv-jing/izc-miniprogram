const app = getApp()

Page({
  data: {

  },
  onLoad(options) {
    this.setData({
      result: '低风险',
      canScan: options.canScan==='true'?true:false
    })
  },
  onShow() {

  },
  toHref(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url
    })
  },
  scan() {
    if (!this.data.canScan) {
      wx.showToast({
        title: '您已经领取过该类型检测盒，请完成检测后再领取',
        icon: 'none'
      })
      return;
    }
    wx.scanCode({
      success: (res) => {
        let {
          result,
        } = res;
        if (result) {
          this.submit(result);
        } else {
          wx.showToast({
            title: '条形码有误！',
            icon: 'none'
          })
        }
      },fail:()=>{
          wx.showToast({
            title: '条形码有误！',
            icon: 'none'
          })
      }
    })
  },
  submit(testing_code) {
    app.api.createTestKit({
      testing_code,
      testing_state:1,
      testing_position:'肠部'
    }).then((res) => {
      wx.hideLoading()
      wx.showToast({
        title: '保存成功！',
        icon: 'none',
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/testKit/scanSucc?number=' + testing_code
        })
      }, 900)
    }).catch((error)=>{
      console.log(error)
      wx.hideLoading()
      if(error.data.message==='添加-试剂盒信息-已经存在'){
        wx.showToast({
          title: '试剂盒已存在！',
          icon: 'none',
        })
      }
    })
  },
})