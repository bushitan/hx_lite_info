// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GLOBAL_PAGE;
Page({
  data:{
      userId:"20014",
      userName:"丰兄",

      //华讯数据
      logo:"",
      name:"",
      level: "", //会员等级
      vipTime:"",

      filter:"全部文章",


      ROLE_NORMAL_ID: 1,
      ROLE_VIP_ID: 2,
      ROLE_SUPER_VIP_ID: 3,
      iconVip: '../../images/vip.png',
      iconSuperVip: '../../images/super_vip.png',

      pay_mode: "",
      page_num: 0,
      artList: [],
      is_srcoll_lock: false,
  },


    addNews(){
        wx.navigateTo({
            url: '../news_input/news_input',
        })
    },

    //筛选历史记录
  historyFilter:function(){


      var _init_name = '全部'
      wx.showActionSheet({
          itemList: [
              _init_name + '文章',
              GLOBAL_PAGE.data.ROLE_NORMAL_NAME+'文章',
              GLOBAL_PAGE.data.ROLE_VIP_NAME +'文章', 
              GLOBAL_PAGE.data.ROLE_SUPER_VIP_NAME +'文章',
              '已购买文章',
            ],
          success: function (res) {
              //   console.log(res.tapIndex)
              GLOBAL_PAGE.setData({
                  page_num: 0,
                  artList: [],
              })

              var _size = 14
              switch (res.tapIndex) {
                  case 0: GLOBAL_PAGE.filterTrace("");
                      GLOBAL_PAGE.setData({
                          pay_mode: ""
                      })
                    break;
                  case 1: 
                    GLOBAL_PAGE.filterTrace(GLOBAL_PAGE.data.ROLE_NORMAL_ID); 
                    _init_name = GLOBAL_PAGE.data.ROLE_NORMAL_NAME
                    GLOBAL_PAGE.setData({
                        pay_mode: GLOBAL_PAGE.data.ROLE_NORMAL_ID
                    })
                    break;
                  case 2: 
                    GLOBAL_PAGE.filterTrace(GLOBAL_PAGE.data.ROLE_VIP_ID);
                    _init_name = GLOBAL_PAGE.data.ROLE_VIP_NAME
                    GLOBAL_PAGE.setData({
                        pay_mode: GLOBAL_PAGE.data.ROLE_VIP_ID
                    })
                    break;
                  case 3: 
                    GLOBAL_PAGE.filterTrace(GLOBAL_PAGE.data.ROLE_SUPER_VIP_ID); 
                    _init_name = GLOBAL_PAGE.data.ROLE_SUPER_VIP_NAME
                    GLOBAL_PAGE.setData({
                        pay_mode: GLOBAL_PAGE.data.ROLE_SUPER_VIP_ID
                    })
                    break;
                //   case 4: GLOBAL_PAGE.filterTrace(PAY_MODE_SINGLE); break;
              }
              GLOBAL_PAGE.setData({
                  fontSize: _size,
                  filter: _init_name + '文章'
              })
          },
          fail: function (res) {
              console.log(res.errMsg)
          }
      })
  },
   
    //按条件过滤
    filterTrace: function (pay_mode) {
        
        wx.request
        ({
            url: API.GetArticleReadTraceSearch,
            method: "GET",
            data: {
                session: wx.getStorageSync(KEY.session),
                pay_mode: pay_mode,
                page_num: GLOBAL_PAGE.data.page_num,
            },
            success: function (res) {
                var object = res.data
                console.log(object)
                if (object.status == "true") //登陆成功
                {

                    var _artList = GLOBAL_PAGE.data.artList
                    if (_artList == -1)
                        _artList = []
                    var _article_list = _artList.concat(object.article_list)

                    GLOBAL_PAGE.setData({
                        artList: _article_list,
                        has_more: object.has_more,
                    })
                    console.log(object.article_list.length)
                    if (pay_mode != "" && object.article_list.length == 0 && GLOBAL_PAGE.data.page_num == 0)
                        wx.showModal({
                            title: '提示',
                            content: '您还未阅读该类文章',
                            showCancel:false,
                        })
                }
                else {

                }
            },
            fail: function (res) {
            },
            complete: () => {
                GLOBAL_PAGE.setData({
                    is_srcoll_lock: false,
                })
            },
        })
    },
  
    scrollBottom() {
        var data = GLOBAL_PAGE.data
        if (data.is_srcoll_lock == false
            && data.has_more == true
        ) {
            var _page_num = data.page_num

            console.log('滑动到底部')
            if (data.has_more == true) {
                GLOBAL_PAGE.setData({
                    page_num: _page_num + 1,
                    is_srcoll_lock: true,
                })
                GLOBAL_PAGE.filterTrace(GLOBAL_PAGE.data.pay_mode)
            }
        }
    },



    // 进入文章
    toArticle:function(e){
        var id = e.currentTarget.dataset.id

        var url = '../detail/detail?art_id=' + id
        wx.navigateTo({
            url: url
        })
    },


  
  //根据id获取节目信息
  onLoad:function(option){
      GLOBAL_PAGE = this

      var res = wx.getSystemInfoSync()
      GLOBAL_PAGE.setData({
          windowHeight: res.windowHeight
      })

      //必须要登陆以后再做的事情
      if(APP.globalData.isLogin == true)
          GLOBAL_PAGE.onInit(option)
      else
          APP.login(option)

  },
  onInit:function(option){
      GLOBAL_PAGE.setData({
        ROLE_NORMAL_ID : APP.STATIC.ROLE_NORMAL_ID,
        ROLE_VIP_ID : APP.STATIC.ROLE_VIP_ID,
        ROLE_SUPER_VIP_ID : APP.STATIC.ROLE_SUPER_VIP_ID,

        ROLE_NORMAL_NAME: APP.STATIC.ROLE_NORMAL_NAME,
        ROLE_VIP_NAME: APP.STATIC.ROLE_VIP_NAME,
        ROLE_SUPER_VIP_NAME: APP.STATIC.ROLE_SUPER_VIP_NAME,
      })
  },

  onShow:function(){
    // 页面显示
      GLOBAL_PAGE.filterTrace("")
  },
 

//   onShareAppMessage: function () { 
    //   return {
    //       title: '叮叮看电视',
    //       desc: '百万部视频，叮叮立即看',
    //       path: '/pages/ware_out/ware_out?id=' + GLOBAL_PAGE.data.id
    //   }
//   },

})