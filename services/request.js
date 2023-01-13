let {
    md5
} = require("./md5.js");

function request(url, method, needOpenid, data = {}) {
    wx.showLoading({
        title: '加载中...',
        mask: true
    })
    return new Promise((resolve, reject) => {
        let openid = wx.getStorageSync('openId');
        let token = wx.getStorageSync('token');
        if (needOpenid && !openid) {
            wx.hideLoading();
            wx.showToast({
                title: "非法请求！",
                icon: "none",
            });
            reject('非法请求！');
        }
        let key = "g5xf5yJbo0x7bef8Kb9";
        let time = +new Date();
        let signArr = [key, openid, time];
        let sign = md5(md5(signArr.sort().join('-')));
        let header = {
            sign,
            time,
            openid,
            Authorization: token ? 'Bearer' + ' ' + token : null
        }
        let baseUrl = getApp().globalData.baseUrl;
        url = baseUrl + url;
        if (needOpenid) {
            data = Object.assign(data, {
                openid
            })
        }

        wx.request({
            header,
            url,
            method,
            data,
            success: (res) => {
                if (res && res.data && res.data.code === 200) {
                    wx.hideLoading();
                    resolve(res.data);
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                    });
                    if(res.data.code===401){
                        wx.clearStorageSync()
                        wx.redirectTo({
                            url: '/pages/register/login',
                        })
                    }
                    reject(res);
                }
            },
            fail: (error) => {
                console.log(url, error);
                wx.hideLoading();
                wx.showToast({
                    title: "请求失败！",
                    icon: "none",
                });
                reject(error);
            },
        });
    });
}

function uploadFile(url, method, file) {
    wx.showLoading({
        title: '加载中...',
        mask: true
    })
    return new Promise((resolve, reject) => {
        let openid = wx.getStorageSync('openId');
        if (!openid) {
            wx.hideLoading();
            wx.showToast({
                title: "非法请求！",
                icon: "none",
            });
            reject('非法请求！');
        }
        let key = "g5xf5yJbo0x7bef8Kb9";
        let time = +new Date();
        let signArr = [key, openid, time];
        let sign = md5(md5(signArr.sort().join('-')));
        let header = {
            sign,
            time,
            openid,
            "content-type": 'application/x-www-form-urlencoded;charset=utf-8',
        }
        let baseUrl = getApp().globalData.baseUrl;
        url = baseUrl + url;
        wx.uploadFile({
            header,
            url,
            method,
            filePath: file,
            name: 'file',
            success: (res) => {
                res.data = JSON.parse(res.data);
                if (res.data.code === 0) {
                    resolve(res.data.data);
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: "请求错误！",
                        icon: "none",
                    });
                    reject(res);
                }
            },
            fail: (error) => {
                wx.hideLoading();
                wx.showToast({
                    title: "请求失败！",
                    icon: "none",
                });
                reject(error);
            },
        });
    });
}

export {request, uploadFile}; // 导出