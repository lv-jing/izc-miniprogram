
export function getUserProfileFun() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
   return new Promise(resolve=>{
        wx.getUserProfile({
            desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res);
                if(res.errMsg==='getUserProfile:ok'){
                 wx.setStorageSync('userInfo', res.userInfo)
                 resolve(res.userInfo)
                }
            },fail(err){
                wx.removeStorageSync('userInfo')
            }
        })
    })
   
}
