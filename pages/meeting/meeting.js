// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var PRO_ARTICLE = require('../../pro/pro_article.js');
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
var YES = 1, NO = 1
Page({
  data:{

  },

  //根据id获取节目信息
  onLoad: function (options) {
      GP = this

      //必须要登陆以后再做的事情
      if (APP.globalData.isLogin == true)
          GP.onInit(options)
      else
          APP.login(options)
  },
  onInit: function (option) {
     
      PRO_PAGE.Init(GP)   //页面基本参数初始化，设置页面名字
      GP.filterTrace("")
  },

  onShow: function () {
      // 页面显示
      if (APP.globalData.isLogin == true) {  //已经登录
          wx.setNavigationBarTitle({  // 设置当前页面
              title: APP.globalData.title
          })
        //   var _father_tag_id = wx.getStorageSync(APP.KEY.FATHER_TAG).tag_id
        //   if (parseInt(_father_tag_id) != parseInt(GP.data.fatherTag.tag_id)) {  //检测是否重新选择行业标签
        //       GP.onInit() //配置默认父类ID
        //   }
      }
  },




    //筛选历史记录
    choiceFilter:function(){
        wx.showActionSheet({
            itemList: [
                "全部",
                "培训",
                "会议",
            ],
            success: function (res) {},
        })

    //   var _init_name = '全部'
    //   wx.showActionSheet({
    //       itemList: [
    //           _init_name + '文章',
    //           GP.data.ROLE_NORMAL_NAME+'文章',
    //           GP.data.ROLE_VIP_NAME +'文章', 
    //           GP.data.ROLE_SUPER_VIP_NAME +'文章',
    //           '已购买文章',
    //         ],
    //       success: function (res) {
    //           //   console.log(res.tapIndex)
    //           GP.setData({
    //               page_num: 0,
    //               artList: [],
    //           })

    //           var _size = 14
    //           switch (res.tapIndex) {
    //               case 0: GP.filterTrace("");
    //                   GP.setData({
    //                       pay_mode: ""
    //                   })
    //                 break;
    //               case 1: 
    //                 GP.filterTrace(GP.data.ROLE_NORMAL_ID); 
    //                 _init_name = GP.data.ROLE_NORMAL_NAME
    //                 GP.setData({
    //                     pay_mode: GP.data.ROLE_NORMAL_ID
    //                 })
    //                 break;
    //               case 2: 
    //                 GP.filterTrace(GP.data.ROLE_VIP_ID);
    //                 _init_name = GP.data.ROLE_VIP_NAME
    //                 GP.setData({
    //                     pay_mode: GP.data.ROLE_VIP_ID
    //                 })
    //                 break;
    //               case 3: 
    //                 GP.filterTrace(GP.data.ROLE_SUPER_VIP_ID); 
    //                 _init_name = GP.data.ROLE_SUPER_VIP_NAME
    //                 GP.setData({
    //                     pay_mode: GP.data.ROLE_SUPER_VIP_ID
    //                 })
    //                 break;
    //             //   case 4: GP.filterTrace(PAY_MODE_SINGLE); break;
    //           }
    //           GP.setData({
    //               fontSize: _size,
    //               filter: _init_name + '文章'
    //           })
    //       },
    //       fail: function (res) {
    //           console.log(res.errMsg)
    //       }
    //   })
    },
   
    //按条件过滤
    filterTrace: function () {
        PRO_ARTICLE.RequestByTag(API, GP, API.ARTICLE_GET_LIST_MEET, "")
       
    },
  
    scrollBottom() {
        if (PRO_ARTICLE.CheckScrollLock(GP)) //通过才能继续查
            GP.filterTrace(GP.data.fatherTag.tag_id) //根据father.tag_id 查供求信息
    },



    // 进入文章
    toArticle:function(e){
        var id = e.currentTarget.dataset.id

        var url = '../detail/detail?art_id=' + id
        wx.navigateTo({
            url: url
        })
    },




//   onShareAppMessage: function () { 
    //   return {
    //       title: '叮叮看电视',
    //       desc: '百万部视频，叮叮立即看',
    //       path: '/pages/ware_out/ware_out?id=' + GP.data.id
    //   }
//   },

})