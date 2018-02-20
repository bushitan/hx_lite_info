// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GP;
Page({
    data: {
      

        roster:{
            address:"",
        }, //花名册对象
    },

    /**
     * 设置标题
     */
    inputName(e){
        var _roster = GP.data.roster
        _roster.user_name = e.detail.value
        GP.setData({
            roster: _roster
        })
    },

    inputPhone(e){
        var _roster = GP.data.roster
        _roster.phone = e.detail.value
            GP.setData({
            roster: _roster
        })
    },

    inputContent(e){

        var _roster = GP.data.roster
        _roster.introduction = e.detail.value
        GP.setData({
            roster: _roster
        })
    },


    inputAddress(e) {

        var _roster = GP.data.roster
        _roster.address = e.detail.value
        GP.setData({
            roster: _roster
        })
    },

    /**
     * 设置经纬度
     */
    getCompanyLocation(){
        wx.chooseLocation({
            success: function (res) {
                var _roster = GP.data.roster
                // console.log(res)
                _roster.address = res.address
                _roster.latitude = res.latitude
                _roster.longitude = res.longitude
                GP.setData({
                    roster: _roster
                })
            },
        }
        )
    },

    /**
     * 显示经纬度
     */
    showCompanyLocation(){
        wx.openLocation({
            latitude: GP.data.roster.latitude,
            longitude: GP.data.roster.longitude,
            scale: 28
        })
    },

    setSelf(){
        API.Request({
            'url': API.ROSTER_SET_SELF,
            'data': GP.data.roster,
            success:function(res){
                wx.showToast({
                    title: '保存名片成功',
                })
                setTimeout(
                    function () {
                        wx.navigateBack({})
                    },
                    1500
                )
               
            },
        })
    },
    //根据id获取节目信息
    onLoad: function (option) {
        GP = this

        var res = wx.getSystemInfoSync()
        GP.setData({
            windowHeight: res.windowHeight
        })

        //必须要登陆以后再做的事情
        if (APP.globalData.isLogin == true)
            GP.onInit(option)
        else
            APP.login(option)

    },

    /**
     * 查看自己的花名册信息
     */
    onInit: function (option) {
        API.Request({
            'url': API.ROSTER_GET_SELF,
            'success':function(res){
                var object = res.data
                GP.setData({
                    roster:object.roster_dict,
                })
            },
        })
        wx.setNavigationBarTitle({  // 设置当前页面
            title: APP.globalData.title
        })
    },

    onShow: function () {
    },


    //   onShareAppMessage: function () { 
    //   return {
    //       title: '叮叮看电视',
    //       desc: '百万部视频，叮叮立即看',
    //       path: '/pages/ware_out/ware_out?id=' + GP.data.id
    //   }
    //   },

})