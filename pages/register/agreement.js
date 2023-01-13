const app = getApp()
import api from "../../services/API";

Page({

    data: {},

    onLoad(options) {
        this.getAgreement();
    },
    getAgreement() {
        wx.showLoading({
            title: '加载中...',
        })
        api.getAgreement().then(res => {
            this.setData({
                text: res.data.text
            })
            wx.hideLoading()
        })
    },
    toHref(e) {
        let pages = getCurrentPages(); // 当前页，
        let prevPage = pages[pages.length - 2]; // 上一页
        prevPage.setData({
            'formObj.agreest': true,
        })
        wx.navigateBack({
            delta: 0,
        })
    },
})