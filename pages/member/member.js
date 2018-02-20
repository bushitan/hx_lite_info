// pages/member/member.js

var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GP;

Page({
    data: {
        member_list: [
        ],
        
        topRoleValue:1,
        ROLE_NORMAL_ID : 1,
        ROLE_VIP_ID: 2,
        ROLE_SUPER_VIP_ID: 3,
        iconVip: '../../images/vip.png',
        iconSuperVip: '../../images/super_vip.png',
    },

    toPay: function () {
        wx.navigateTo({
            url: '../pay/pay',
        })
    },
    toPayRenew: function () {
        wx.navigateTo({
            url: '../pay_renew/pay_renew',
        })
    },

    getMember:function(){
        console.log(APP.globalData.userMemberList )
        GP.setData({
            member_list: APP.globalData.userMemberList
        })
    },
    //根据id获取节目信息
    onLoad: function (option) {
        // 页面初始化 options为页面跳转所带来的参数
        GP = this
        wx.setNavigationBarTitle({  // 设置当前页面
            title: APP.globalData.title
        })
        //必须要登陆以后再做的事情
        if (APP.globalData.isLogin == true)
            GP.onInit(option)
        else
            APP.login(option)
    },
    onInit() { 
        GP.getMember()
        var topRoleValue = GP.data.topRoleValue
        var _father_tag_id = wx.getStorageSync(APP.KEY.FATHER_TAG).tag_id
        var _user_member_list = APP.globalData.userMemberList
        for (var i=0; i<_user_member_list.length;i++ )
            if (_father_tag_id == _user_member_list[i].tag_id){
                if (topRoleValue<_user_member_list[i].role_value)
                    topRoleValue = _user_member_list[i].role_value
            }
        GP.setData({
            topRoleValue: topRoleValue
        })

    },
    onShow: function (option) {
        // 页面初始化 options为页面跳转所带来的参数
   
        GP.getMember()

    },


})