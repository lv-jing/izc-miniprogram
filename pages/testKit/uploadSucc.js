const app = getApp()

Page({
  data: {
    reagentCode: '',
    tempFilePaths: ''
  },
  onLoad(options) {
    this.setData({
      number: options.number,
      fileID: options.fileid
    })
  },
  onShow() {

  },

})