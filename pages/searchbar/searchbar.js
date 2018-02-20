
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var PRO_ARTICLE = require('../../pro/pro_article.js');
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
var YES = 1, NO = 1
Page({
    data: {
        inputShowed: false,
        inputVal: "",

        parentTagList:"",//父类标签
        tagList:"",//子类标签
        ROLE_NORMAL_ID: 1,
        ROLE_VIP_ID: 2,
        ROLE_SUPER_VIP_ID: 3,
        iconVip: '../../images/vip.png',
        iconSuperVip: '../../images/super_vip.png',


        articleList: [],
        startIndex: 0,   //文章初始查询位置
        rangeIndex: 10,  //查询范围
        isMore: false,    //是否还有更多文章
        isScrollLock: false, //查询锁，防止结果未返回，又继续查
        is_srcoll_lock: false,

        dateStart: "",
        dateEnd: "",
    },
    clickStart(e) {
        GP.setData({
            dateStart: e.detail.value 
        })
    },
    clickEnd(e) {
        GP.setData({
            dateEnd: e.detail.value
        })
    },

    onShow: function () {
        // 页面显示
        // GP.filterTrace("")
    },

    /**
     *  事件
     *  点击搜索按钮
     */
    getSearch: function () {
        var _page_num = 0
        GP.setData({
            keyword_title: GP.data.inputVal,
        })
        PRO_ARTICLE.ClearArticle(GP)
        GP.getMatchListByTag()
    },
  
    /**
   * 查询 match_list  根据tag
   * 唯一变动的地方
   */
    getMatchListByTag() {

        PRO_ARTICLE.RequestBySearch(API, GP, API.ARTICLE_GET_LIST_SEARCH, GP.data.keyword_title )
    },

    scrollBottom(e) {
        if (PRO_ARTICLE.CheckScrollLock(GP)) //通过才能继续查
            GP.getMatchListByTag() //根据father.tag_id 查供求信息

    },

    bannerToArticle: function (e) {
        GP.checkArticle(e)
    },
    // 进入文章
    checkArticle: function (e) {
        var article_id = e.currentTarget.dataset.article_id

        var url = '../detail/detail?art_id=' + article_id + "&share=1"
        wx.navigateTo({
            url: url
        })
    },
    onLoad:function(){
        GP = this
        var a = new Date()
        var _today = a.toLocaleDateString().replace("/", "-").replace("/", "-")
        GP.setData({
            dateStart: _today,
            dateEnd: _today
        })


        wx.setNavigationBarTitle({  // 设置当前页面
            title: APP.globalData.title
        })
    },
    
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    }
});