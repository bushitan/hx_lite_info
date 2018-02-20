// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
Page({
  data:{
      roster:{},
    },
  
    clickLocation(){
        wx.openLocation({
            latitude: GP.data.roster.latitude,
            longitude: GP.data.roster.longitude,
            // scale: 28
        })
    },

    clickPhone(){
        wx.makePhoneCall({
            phoneNumber: GP.data.roster.phone //仅为示例，并非真实的电话号码
        })
    },







    addNews(){

    },
  

  //根据id获取节目信息
    onLoad: function (options){
      GP = this

      //必须要登陆以后再做的事情
      if(APP.globalData.isLogin == true)
          GP.onInit(options)
      else
          APP.login(options)

    },
    onInit: function (options){
        PRO_PAGE.Init(GP)   //页面基本参数初始化，设置页面名字

        API.Request({
            "url": API.ROSTER_GET_ID,
            "data":{
                roster_id: options.roster_id
            },
            "success":function(res){
                var object = res.data
                GP.setData({
                    roster: object.roster_dict
                })
            },
        })
    },

    onShow:function(){

    },
 

//   onShareAppMessage: function () { 
    //   return {
    //       title: '叮叮看电视',
    //       desc: '百万部视频，叮叮立即看',
    //       path: '/pages/ware_out/ware_out?id=' + GP.data.id
    //   }
//   },

})