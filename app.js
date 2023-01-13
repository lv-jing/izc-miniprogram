import api from "./services/API";

const QQMapWX = require("./utils/qqmap-wx-jssdk.js");
const qqmapsdk = new QQMapWX({
    key: "HLFBZ-XSTKF-SG4JD-NEKE6-DKPRF-JEF4K",
});

//强制小程序重启并使用新版本
function updateManagerFn() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
        console.log("请求完新版本信息的回调,", res.hasUpdate);
    });

    updateManager.onUpdateReady(() => {
        wx.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success: (res) => {
                if (res.confirm) {
                    updateManager.applyUpdate();
                }
            },
        });
    });
    updateManager.onUpdateFailed(() => {
        console.warn("新版本下载失败");
    });
}

updateManagerFn();

App({
    globalData: {
        version: "1.0.0", //版本号
        env: "faxiao-product-9g5x5ybo07bef8b4", //云环境id-正式环境
        openTest: true, //测试入口是否开启
        userInfo: {
            openId: null, //用户OPENID
            isRegister: false,
            isCompleteQuestionnaire: false,
        },
        qqmapsdk,
        isOpenSetting: false,
        // baseUrl: "http://192.168.1.4:8080/api", // 本地
        // baseUrl: "http://119.91.218.41:8080/api", //测试环境
        baseUrl: "https://izc.farsail.net.cn/miniapp/api", // 生产
    },
    api,
    onError(err) {
        console.error("App onError,", err);
    },

    onLaunch(options) {
        this.initCloud();
    },
    initCloud() {
        if (!wx.cloud) {
            console.error("请使用 2.2.3 或以上的基础库以使用云能力");
        } else {
            wx.cloud.init({
                env: this.globalData.env,
                traceUser: true,
            });
            this.db = wx.cloud.database();
        }
    },

    async getOpenId() {
        wx.login({
            success(res) {
                if (res.code) {
                    api.getOpenId({jsCode: res.code}).then((res) => {
                        wx.setStorageSync('openid', res.openid)
                    })
                    //发起网络请求
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },

    //获取各种数据
    async getPatientInfo(type) {
        let phone = wx.getStorageSync('phone')
        await api.findByPhone({phone}).then(async (res) => {
            if (res) {
                if (res.data.name && res.data.phone) {
                    res.data.age = new Date().getFullYear() - new Date(res.data.birthday).getFullYear();
                    this.globalData.patientInfo = res.data;
                    wx.hideLoading();
                    if (type === 'login') {
                        wx.switchTab({
                            url: '/pages/home/home',
                        })
                    }
                } else {
                    if(res.data.phone){
                        this.globalData.patientInfo = res.data;
                        wx.hideLoading();
                        wx.redirectTo({
                            url: '/pages/register/patientInfo',
                        })
                    } else {
                        wx.clearStorageSync()
                        wx.hideLoading();
                        wx.redirectTo({
                            url: '/pages/login/login',
                        })
                    }
                }
            }
        })
    },
    // 获取更新后的信息
    async getInfo() {
        let phone = wx.getStorageSync('phone')
        await api.findByPhone({phone}).then(async (res) => {
            res.data.age = new Date().getFullYear() - new Date(res.data.birthday).getFullYear();
            this.globalData.patientInfo = res.data;
        })
    },
    db: null,
    formatTime(format, time = +new Date()) {
        //'yyyy年MM月dd日hh:mm:ss'
        const t = new Date(time);
        const db = function (i) {
            return (i < 10 ? "0" : "") + i;
        };
        return format.replace(/yyyy|MM|dd|hh|mm|ss/g, function (a) {
            switch (a) {
                case "yyyy":
                    return db(t.getFullYear());
                    break;
                case "MM":
                    return db(t.getMonth() + 1);
                    break;
                case "dd":
                    return db(t.getDate());
                    break;
                case "hh":
                    return db(t.getHours());
                    break;
                case "mm":
                    return db(t.getMinutes());
                    break;
                case "ss":
                    return db(t.getSeconds());
                    break;
            }
        });
    },
    //获取我的位置
    async getLocation() {
        return new Promise((resolve, reject) => {
            wx.getLocation({
                type: "gcj02",
            })
                .then((res) => {
                    this.globalData.my_location = res;
                    resolve(res);
                })
                .catch(() => {
                    if (this.globalData.isOpenSetting) return;
                    this.globalData.isOpenSetting = true;
                    wx.showModal({
                        title: "提示",
                        content: "您未授权位置信息，部分信息将不显示！是否开启授权",
                        confirmText: "去授权",
                        cancelText: "不授权",
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({});
                            }
                        },
                    });
                    reject();
                });
        });
    },

    //获取当前位置具体医院的距离
    async getDistance(toArr) {
        let {
            latitude,
            longitude
        } = this.globalData.my_location;
        let result = [];
        await qqmapsdk.calculateDistance({
            mode: "straight",
            from: {
                latitude,
                longitude,
            },
            to: toArr,
            sig: "jzQTXPZc23sS03OoWMc4nvsem9nIwhvr",
            success: (res) => {
                result = res.result.elements;
            },
        });
        let dictanceArr = [];
        result.forEach((element) => {
            let curDictance = parseInt(element.distance / 1000) + "km";
            dictanceArr.push(curDictance);
        });
        return dictanceArr;
    },

    //地址转坐标
    async geocoder(address) {
        return await qqmapsdk.geocoder({
            address,
            sig: "jzQTXPZc23sS03OoWMc4nvsem9nIwhvr",
            success: (res) => {
                console.log(res.result.location);
                return res.result.location;
            },
        });
    },
});