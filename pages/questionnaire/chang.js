const app = getApp()
Page({
    data: {
        index: 0,
        curSonIndex: -1,
        curIndex: 0,
        qas: [],
        throttleInitTime: 0,
        qaType: 2,
        qaPos:'肠'
    },
    onShow() {
        app.api.getQuestionnaire({position: 2}).then(res => {
            if (res.code === 200) {
                this.setData({
                    qas: res.data.content
                })
            }
        })
    },
    onLoad(options) {

    },
    checkboxChange(e) {
        const items = this.data.items
        const values = e.detail.value
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            items[i].checked = false

            for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (items[i].value === values[j]) {
                    items[i].checked = true
                    break
                }
            }
        }

        this.setData({
            items
        })
    },
    //节流
    throttle(fn, delay = 1000) {
        let throttleInitTime = this.data.throttleInitTime
        return () => {
            let now = +new Date();
            if (now - throttleInitTime >= delay) {
                fn.apply(this, arguments)
                this.setData({
                    throttleInitTime: now
                })
            }
        }
    },

    //上一题
    to_last_question() {
        let curIndex = this.data.curIndex;
        curIndex--;
        this.setData({
            curIndex
        })
    },

    //下一题
    to_next_question() {
        this.throttle(() => {
            let {
                qas,
                curIndex
            } = this.data;
            if (!qas[curIndex].val) {
                wx.showToast({
                    title: '请选择答案！',
                    icon: 'none'
                })
                return;
            }
            if (curIndex < (qas.length - 1)) {
                curIndex++;
                this.setData({
                    curIndex
                })
                return;
            }

            this.saveQuestionnaire();
        }, 600)()
    },

    saveQuestionnaire() {
        let phone = wx.getStorageSync('phone')
        app.api.recordAdd({
            phone,
            qAndA: this.data.qas,
            position: this.data.qaType
        }).then(res => {
            if (res.code === 200) {
                let id = res.data.id
                wx.hideLoading()
                setTimeout(() => {
                    wx.redirectTo({
                        url: '/pages/questionnaire/result?id=' + id,
                    })
                }, 100)
            }
        })
    },
    //select change
    selectValue(e) {
        let {
            val,
        } = e.currentTarget.dataset;
        let curIndex = this.data.curIndex;
        let name = `qas[${curIndex}].val`;
        this.setData({
            [name]: val
        })
    },
})