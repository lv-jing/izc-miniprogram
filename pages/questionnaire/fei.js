const app = getApp()
Page({
    data: {
        index: 0,
        curSonIndex: -1,
        curIndex: 0,
        qas: [
            // {
            //     title: '如果吸烟，你的吸烟包年数[吸烟包年数=每天吸烟的包数（每包20支)×吸烟年数]为',
            //     options: ['吸烟包年数≥30', '曾经吸烟包年数≥30，但戒烟不足15年', '吸烟包年数<30', '不吸烟']
            // },
            // {
            //     title: '是否与吸烟者共同生活或同室工作被动吸烟超过20年',
            //     options: ['是', '否']
            // },
            // {
            //     title: '是否患有慢性阻塞性肺疾病(COPD)',
            //     options: ['是', '否']
            // },
            // {
            //     title: '是否有职业暴露史超过1年（包括暴露于石棉、氡、铍、铬、镉、硅、煤烟和煤烟尘)',
            //     options: ['是', '否']
            // },
            // {
            //     title: '是否有一级亲属（(指父母、子女及同父母的兄弟姐妹)确诊肺癌',
            //     options: ['是', '否']
            // },
        ],
        throttleInitTime: 0,
        qaType: 1,
        qaPos: '肺'
    },
    onShow(){
        app.api.getQuestionnaire({position:1}).then(res=>{
            if(res.code===200){
                this.setData({
                    qas:res.data.content
                })
            }
        })
    },
    onLoad(options) {

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
        }).then(res=>{
            if(res.code===200){

                let id = res.data.id
                console.log(id);
                wx.hideLoading()
                setTimeout(() => {
                    wx.redirectTo({
                        url: '/pages/questionnaire/result?id='+id,
                    })
                }, 100)
            }
        })

    },
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