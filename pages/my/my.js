

// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GP;


//历史记录筛选方式
// var ROLE_NORMAL_ID 
// var ROLE_VIP_ID
// var ROLE_SUPER_VIP_ID

// var PAY_MODE_SINGLE = 3;
  
Page({
    data:{

        //华讯数据
        name: "",
        user_id:"",

        icon_news_self: "../../images/news_self.png",
        icon_roster: "../../images/my_roster.png",
        icon_vip: "../../images/my_vip.png",
        icon_meet: "../../images/my_meet.png",
        icon_discount: "../../images/my_discount.png",
        icon_search: "../../images/my_search.png",
        
       
        icon1: '../../images/mine_fill.png',
        icon2: '../../images/order_fill.png',
        icon3: '../../images/coupons_fill.png',
        icon4: '../../images/label_fill.png',
        icon5: '../../images/search_blue.png',
        // icon4: '../../images/label_fill.png',
        
    },

   
    clickLogo:function(){
        wx.openSetting({
            success: (res) => {
                console.log("授权结果..")
                console.log(res)
                if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                    GP.SetUserInfo()
                }
            }
        })
    },

    SetUserInfo:() =>{
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo
                // var nickName = userInfo.nickName
                // var avatarUrl = userInfo.avatarUrl
                // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                // var province = userInfo.province
                // var city = userInfo.city
                // var country = userInfo.country
                console.log(userInfo)
                GP.setData({
                    logo: userInfo.avatarUrl,
                    name: userInfo.nickName,
                })
                wx.request
                ({
                    url: API.MY_SET_WX,
                    method: "GET",
                    data: {
                        session : wx.getStorageSync(KEY.session),
                        logo_url : userInfo.avatarUrl,
                        nick_name : userInfo.nickName,
                    },
                    success: function (res) {
                        var object = res.data
                        console.log(object)
                        if (object.status == "true") //登陆成功
                        {
                            wx.showToast({
                                title: '登陆成功',
                            })
                        }
                        else {

                        }
                    },
                    fail: function (res) {
                    },
                })
            },
            fail(){
                wx.showModal({
                    title: '温馨提示',
                    content: '左上角"点击登录"，可重新登录',
                    showCancel:false,
                    confirmText:'知道了',
                })
            }
        })
    },

    //根据id获取节目信息
    onLoad:function(option){
        // 页面初始化 options为页面跳转所带来的参数
            GP = this

        //必须要登陆以后再做的事情
        if(APP.globalData.isLogin == true)
            GP.onInit(option)
        else
            APP.login(option)

    },

    //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
        GP.setData({
            user_id: APP.globalData.user_id,
            logo: APP.globalData.logo,
            nick_name: APP.globalData.nick_name,
        })

        GP.SetUserInfo()
        wx.setNavigationBarTitle({  // 设置当前页面
            title: APP.globalData.title 
        })

        // GP.chechRemain()
  },
    chechRemain(){
        if (APP.checkMember() == false)
            console.log("不是该行业的会员")
        else{
            var _father_tag = wx.getStorageSync(APP.KEY.FATHER_TAG)
            console.log(_father_tag)
            console.log(APP.globalData.tagFatherList)
            console.log(APP.globalData.userMemberList)
            var _member_list = APP.globalData.userMemberList
            var _content = ""
            for (var i = 0; i < _member_list.length ; i++){
                    if (_member_list[i].remain_time > 30 )
                        _content += _father_tag.tag_name + '会员还有' + _member_list[i].remain_time + "天到期。"
            }

            if ( _content != '')
                _content = _content + "请及时续费"
                wx.showModal({
                    title: '温馨提示',
                    content: _content,
                })
        }
    },


    onShow(){
        if (APP.globalData.isLogin == true) {  //已经登录
            wx.setNavigationBarTitle({  // 设置当前页面
                title: APP.globalData.title
            })
        }
    },



//   onShareAppMessage: function () { 
//       return {
//           title: '叮叮看电视',
//           desc: '百万部视频，叮叮立即看',
//           path: '/pages/ware_out/ware_out?id=' + GP.data.id
//       }
//   },
    // wx.getLocation({
    //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //     success: function (res) {
    //         var latitude = res.latitude
    //         var longitude = res.longitude
    //         wx.openLocation({
    //             latitude: latitude,
    //             longitude: longitude,
    //             scale: 28
    //         })
    //     }
    // })
    getCompanyLocation: function () {
        wx.chooseLocation()
        
        // wx.getLocation({
        //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        //     success: function (res) {
        //         var latitude = res.latitude
        //         var longitude = res.longitude
        //         wx.openLocation({
        //             latitude: latitude,
        //             longitude: longitude,
        //             scale: 28
        //         })
        //     }
        // })
    },



    toMember: function () {
        wx.navigateTo({
            url: '../member/member',
        })
    },


    toMeetingSelf: function () {
        wx.navigateTo({
            url: '../meeting_self/meeting_self',
        })
    },
    toNewsSelf: function () {
        wx.navigateTo({
            url: '../news_self/news_self',
        })
    },

    toRoster: function () {
        wx.navigateTo({
            url: '../roster/roster',
        })
    },
    toRosterSelf: function () {
        wx.navigateTo({
            url: '../roster_self/roster_self',
        })
    },
    toOrder: function () {
        wx.navigateTo({
            url: '../order/order',
        })
    },

    toDiscount: function () {
        wx.navigateTo({
            url: '../discount/discount',
        })
    },
    toHistory: function () {
        wx.navigateTo({
            url: '../history/history',
        })
    },
    toSearch: function (e) {
        var id = e.currentTarget.dataset.id

        var url = '../searchbar/searchbar'
        wx.navigateTo({
            url: url
        })

    },
})