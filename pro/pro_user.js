

function AlertModal(level, vip_time) {
    var PAY_MODE = {
        0: "普通用户",
        1: '黄金会员',
        2: '超级会员',
        3: "点播付费",
    }

    if (level == 0)
        wx.showModal({
            title: '尊敬的用户',
            content: '您本期的会员服务期限将于' + vip_time + '到期，届时会影响到您在此系统对资讯的阅读，请您及时续费。',
            confirmText: "续费升级",
            cancelText: "稍后支付",
            success: function (res) {
                if (res.confirm) {
                    wx.showActionSheet({
                        itemList: ['升级到高级VIP会员', '续费VIP会员'],
                        success: function (res) {
                            console.log(res.tapIndex)
                        },
                        fail: function (res) {
                            console.log(res.errMsg)
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
        })
    if (level == 1)
        wx.showModal({
            title: '尊敬的VIP用户',
            content: '您本期的会员服务期限将于' + vip_time + '到期，届时会影响到您在此系统对资讯的阅读，请您及时续费。',
            confirmText: "续费升级",
            cancelText: "稍后支付",
            success: function (res) {
                if (res.confirm) {
                    wx.showActionSheet({
                        itemList: ['升级到高级VIP会员', '续费VIP会员'],
                        success: function (res) {
                            console.log(res.tapIndex)
                        },
                        fail: function (res) {
                            console.log(res.errMsg)
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
        })
    if (level == 2)
        wx.showModal({
            title: '尊敬的高级VIP用户',
            content: '您本期的会员服务期限将于' + vip_time + '到期，届时会影响到您在此系统对资讯的阅读，请您及时续费。',
            confirmText: "续费",
            cancelText: "稍后支付",
            success: function (res) {
                if (res.confirm) {
                    wx.showActionSheet({
                        itemList: ['升级到高级VIP会员', '续费VIP会员'],
                        success: function (res) {
                            console.log(res.tapIndex)
                        },
                        fail: function (res) {
                            console.log(res.errMsg)
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
        })
}


module = {

}