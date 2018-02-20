// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var PRO_ARTICLE = require('../../pro/pro_article.js');
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
var YES = 1, NO = 0
Page({
  data:{
      inputVal:"",
    //   userId:"20014",
    //   userName:"丰兄",

    //   //华讯数据
    //   logo:"",
    //   name:"",
    //   level: "", //会员等级
    //   vipTime:"",

    //   filter:"松香",


    //   ROLE_NORMAL_ID: 1,
    //   ROLE_VIP_ID: 2,
    //   ROLE_SUPER_VIP_ID: 3,
    //   iconVip: '../../images/vip.png',
    //   iconSuperVip: '../../images/super_vip.png',

    //   pay_mode: "",
    //   page_num: 0,
    //   artList: [],
    //   is_srcoll_lock: false,
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

    onShow: function () {
        if (APP.globalData.isLogin == true) {  //已经登录
            var _father_tag_id = wx.getStorageSync(APP.KEY.FATHER_TAG).tag_id
            if (parseInt(_father_tag_id) != parseInt(GP.data.fatherTag.tag_id)) {  //检测是否重新选择行业标签
                GP.onInit() //配置默认父类ID
            }
        }
        // 页面显示
    },

    onInit: function (options) {
        var _matrix = APP.globalData.tagMatrix //获取 标签矩阵
        var _father_tag = wx.getStorageSync(APP.KEY.FATHER_TAG)

        //初始化各参数
        GP.setData({
            fatherTag: _father_tag,
            showDialog: false, //显示子标签选择提示框
            showAreaDialog:false, //区域选择框
            showSonTagName: "所有专业",
            filter: "全部搜索",
            checkMember : APP.checkMember()  //检测
        })

        PRO_PAGE.Init(GP)   //页面基本参数初始化，设置页面名字
        GP.filterTrace(_father_tag.tag_id)

        GP.getAreaList() //获取所有区域
    },


    //筛选历史记录
    choiceFilter:function(){
        wx.showActionSheet({
            itemList: [
                "松香",
                "活性炭",
                "糠醛",
                "酒精",
                "桐油",
            ],
            success: function (res) {
            },
            fail: function (res) {
            }
        })
  },



    //进入会员详细信息
    toRosterDetail:function(e){

        // var _check = APP.checkMember()  //检测
        if (GP.data.checkMember == false){
            wx.showModal({
                title: '温馨提示',
                content: '成为' + wx.getStorageSync(APP.KEY.FATHER_TAG).tag_name + '会员能够浏览',
                confirmText: '成为会员',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "../pay/pay"
                        })
                    }
                }
            })
            return
        }



        var id = e.currentTarget.dataset.id
        var url = '../roster_detail/roster_detail?roster_id=' + id
        wx.navigateTo({
            url: url
        })
    },





    //按条件过滤
    filterTrace: function (tag_id) {
        PRO_ARTICLE.RequestByTag(API, GP, API.ROSTER_GET_TAG, tag_id)
    },
    scrollBottom(e) {
       

        if (PRO_ARTICLE.CheckScrollLock(GP)) //通过才能继续查
            if (GP.data.isSearch)
                GP.getBySearch()
            else
                GP.filterTrace(GP.data.fatherTag.tag_id) //根据father.tag_id 查供求信息

    },
    /**
     *  事件
     *  点击搜索按钮
     */
    getSearch: function () {
        var _page_num = 0
        GP.setData({
            keyword_title: GP.data.inputVal,
            isSearch:true,
        })
        PRO_ARTICLE.ClearArticle(GP)
        GP.getBySearch()
    },
    getBySearch(){
        var fathr_tag_id = GP.data.fatherTag.tag_id
        if (GP.data.inputVal == "")
            GP.filterTrace(GP.data.fatherTag.tag_id)
        else
            PRO_ARTICLE.RequestByRosterSearch(API, GP, API.ROSTER_GET_LIST_SEARCH, GP.data.keyword_title, fathr_tag_id)
        
            
    },
    clearInput: function () {
        this.setData({
            inputVal: "",
            isSearch: false,
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },

    // 全部
    getByAll(){
      GP.setData({
        keyword_title: '',
        isSearch: true,
      })
      PRO_ARTICLE.ClearArticle(GP)
      GP.getBySearch()
    },

    // 供应
    sellChange(e) {
      var tag_id = GP.data.fatherTag.match_list[e.detail.value].tag_id
      var is_buy = YES
      PRO_ARTICLE.ClearArticle(GP)
      PRO_ARTICLE.RequestByRosterMatch(API, GP, API.ROSTER_GET_LIST_MATCH, is_buy, tag_id)
    },

    // 求购
    buyChange(e){
      var tag_id = GP.data.fatherTag.match_list[e.detail.value].tag_id
      var is_buy = YES
      PRO_ARTICLE.ClearArticle(GP)
      PRO_ARTICLE.RequestByRosterMatch(API, GP, API.ROSTER_GET_LIST_MATCH, is_buy, tag_id)
    },


    //获取地区
    getAreaList(){
      API.Request({
        'url': API.ROSTER_GET_AREA_LIST,
        'success': function (res) {
          GP.setData({
            areaList:res.data.area_list,
          })
        },
      })
    },
    //区域发生改变
    areaChange(e){
      var area_id = GP.data.areaList[e.detail.value].area_id
      PRO_ARTICLE.ClearArticle(GP)
      PRO_ARTICLE.RequestByRosterArea(
        API, GP, 
        API.ROSTER_GET_LIST_AREA, area_id,
        GP.data.fatherTag.tag_id
      )
    },



})