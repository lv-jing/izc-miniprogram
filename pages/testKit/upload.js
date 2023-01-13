const app = getApp()

Page({
  data: {
    reagentCode: ''
  },

  onLoad(options) {
    console.log(options)
    this.setData({
      number: options.number
    })
  },

  onShow() {},

  videoErrorCallback(e) {
    console.log('视频错误信息:', e.detail.errMsg)
  },

  //拍照上传
  photoUpload() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        let succ = await app.api.uploadFile(res.tempFilePaths[0]);
        this.submit('https://'+succ.file_url);
      }
    })
  },
  submit(result_pic) {
    let number=this.data.number
    app.api.updateReport({
      result_pic,
      testing_state: 2,
      testing_code: number
    }).then((res) => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功！',
        icon: 'none'
      })
      setTimeout(() => {
        let url = '/pages/testKit/uploadSucc?number=' + number + '&fileid=' + result_pic;
        wx.redirectTo({
          url
        })
      }, 900)
    })
  }
})