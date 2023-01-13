const app = getApp()
import {
    getUserProfileFun
} from '../../utils/common'
import api from "../../services/API";

Page({
    data: {
        formObj: {
            phone: '',
            code: '',
            agreest: false
        },
        sendCodeFlag: true,
        sendCodeText: '获取验证码',
        show: false
    },

    onLoad(e) {

    },

    onShow() {
        wx.hideHomeButton();
        app.getOpenId()
    },
    async getUserProfile(e) {
        this.onClose();
        await getUserProfileFun()
    },
    onClose() {
        this.setData({
            show: false
        });
    },
    toHref(e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url
        })
    },

    //选择是否同意协议
    selectAgreest() {
        let formObj = this.data.formObj;
        formObj.agreest = !formObj.agreest
        this.setData({
            formObj
        })
    },

    //表单输入
    input(e) {
        let field = e.currentTarget.dataset.field;
        this.setData({
            [`formObj.${field}`]: e.detail.value
        })
    },

    //验证码倒计时
    countDown() {
        let time = 60;
        let timerfn = setInterval(() => {
            if (time == 0) {
                clearInterval(timerfn)
                this.setData({
                    sendCodeText: '获取验证码',
                    sendCodeFlag: true
                })
                return
            }
            time--;
            this.setData({
                sendCodeText: time + 'S后再获取'
            })
        }, 1000)
    },

    //发送验证码
    sendCode() {
        let sendCodeFlag = this.data.sendCodeFlag;
        if (!sendCodeFlag) {
            return;
        }
        if (!/^1[3-9]{1}[0-9]{9}$/.test(this.data.formObj.phone)) {
            return wx.showToast({
                title: '请输入正确的手机号!',
                icon: 'none'
            })
        }
        this.sendSMS();
    },

    //获取短信api
    sendSMS() {
        let mobile = this.data.formObj.phone;
        wx.showLoading({
            title: '发送中...',
            mask: true
        })
        api.getSms({phone: mobile}).then((res) => {
            wx.hideLoading();
            if (res.code === 200) {
                this.setData({
                    sendCodeFlag: false
                })
                this.countDown();
                wx.showToast({
                    title: '发送成功！',
                    mask: true
                })
            }
        })
    },

    //登录
    login() {
        let {
            phone,
            code,
            agreest
        } = this.data.formObj;
        if (!/^1[3-9]{1}[0-9]{9}$/.test(phone)) {
            return wx.showToast({
                title: '请输入正确的手机号!',
                icon: 'none'
            })
        }
        if (code.length !== 6) {
            return wx.showToast({
                title: '请输入验证码',
                icon: 'none'
            })
        }
        if (!agreest) {
            return wx.showToast({
                title: '请同意癌症筛查协议',
                icon: 'none'
            })
        }

        this.submit();
    },

    //登录api
    submit() {
        wx.showLoading({
            title: '保存中...',
            mask: true
        })
        let {phone, code} = this.data.formObj;
        wx.setStorageSync('phone', phone)
        let openid = wx.getStorageSync('openid')
        api.checkCode({code, phone}).then(res => {
            if (res.code === 200) {
                wx.setStorageSync('token', res.token)
                let userInfo = wx.getStorageSync('userInfo')
                if (userInfo && userInfo.avatarUrl && !res.data.avatar) {
                    api.changeAvatar({phone, avatar: userInfo.avatarUrl})
                }
                if (res.registered) {
                    app.getPatientInfo('login')
                } else {
                    api.getLogin({phone, openid}).then(res => {
                        if (res.code === 200) {
                            wx.hideLoading();
                            app.getPatientInfo('login')
                        }
                    })
                }
            } else {
                wx.hideLoading();
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    mask: true
                })
            }
        })
    }
})