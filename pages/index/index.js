// pages/together/together.js
var QUERY = require('../../action/query.js');
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var PRO_ARTICLE = require('../../pro/pro_article.js');
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
var ROLE_LEVEL_1 = 1,
ROLE_LEVEL_2 = 2,
ROLE_LEVEL_3 = 3

Page({
  data:{    
        //在pro_page.init() 中已经初始化
        // fatherTag: father_tag, //当前父类标签
        // articleList: [],    //文章列表
        // startIndex: 0,   //文章初始查询位置
        // rangeIndex: 10,  //查询范围 
        // isMore: true,    //是否还有更多文章
        // isScrollLock: false, //查询锁，防止结果未返回，又继续查

        sonTagID: "",    //当前  
        showTagName: "",
        showSonTagList: [],
        tagMatrix:"", //标签的二维数组
    }, 
    
    /**
     * 直接跳转到支付页面
     */
  dialogMember(role_value, article_id){
        var _str
        if (role_value == ROLE_LEVEL_3)
            _str = "资讯会员"
        else
            _str = "短信会员"
        wx.showModal({
            title: '温馨提示',
            content: '成为' + wx.getStorageSync(APP.KEY.FATHER_TAG).tag_name +'"'+ _str + '"' +'能够浏览',
            confirmText: '成为会员',
            success: function (res) {
                if (res.confirm) {
                    // console.log('去pay页面')
                    wx.navigateTo({
                        url: '../pay/pay?article_id=' + article_id
                    })

                }
            }
        })
    },

    toArticle(article_id){
        var articleList = GP.data.articleList
        wx.setStorageSync("current_article_list", articleList)
        var url = '../detail/detail?art_id=' + article_id
        wx.navigateTo({
            url: url
        })

    },

    /**
     * 点击文章
     */
    checkArticle:function(e){
        var article_id = e.currentTarget.dataset.article_id
        var _role_value = e.currentTarget.dataset.role_value
        if (_role_value > ROLE_LEVEL_1) { //当不是普通文章
            if (APP.checkMember(_role_value) == false) {  //如果会员不满足
               API.Request({
                   'url': API.ARTICLE_CHECK_SINGLE,
                   'data':{
                       'article_id': article_id,
                   },
                   success:function(res){
                        if (res.data.is_single)
                            GP.toArticle(article_id)
                        else
                            GP.dialogMember(_role_value, article_id)
                   },
               })

               return
            }
        }
        
        GP.toArticle(article_id)
    },
    /**
     * 点击滚动栏
     */
    bannerToArticle: function (e) {
        var article_id = e.currentTarget.dataset.article_id
        wx.setStorageSync("current_article_list", [])
        var url = '../detail/detail?art_id=' + article_id
        wx.navigateTo({
            url: url
        })

    },

    /**
     * index初始化
     * 加载默认的标签
     */
    onLoad:function(options){
        GP = this
        QUERY.init(APP,GP)
        console.log(QUERY.getGP())
        
        GP.getIndustry()
        // // wx.request({
        // API.Request({
        //     url: 'https://api.308308.com/cms/ca/get_info_by_openid?access_token=6ef82ff5fb537e755335bc2da691c79e', //仅为示例，并非真实的接口地址
        //     // url: 'https://api.308308.com/cms/ca/get_info_by_openid/', //仅为示例，并非真实的接口地址
        //     method:"POST",
        //     data: {
        //         "open_id": "oNUgxv608YVIclrLMz_0egqocXcI",
        //         // "access_token":"6ef82ff5fb537e755335bc2da691c79e",
        //     },
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: function (res) {
        //         console.log(res.data)
        //     }
        // })



        // //必须要登陆以后再做的事情
        // if(APP.globalData.isLogin == true)
        //     GP.onInit(options)
        // else
        //     APP.login(options)

    },

    getIndustry(){
        API.Request({
            url: API.API_308_GET_ALL_INDUSTRY,
            data: {},
            success: function (res) {
                console.log(res.data)
            }
        })

            
    },



    /**
     * 选择新行业后返回，更新默认目录
     */
    onShow() {
        console.log(QUERY.getGP())
        if (APP.globalData.isLogin == true){  //已经登录
            var _father_tag_id = wx.getStorageSync(APP.KEY.FATHER_TAG).tag_id
            if ( parseInt(_father_tag_id) != parseInt(GP.data.fatherTag.tag_id) ) {  //检测是否重新选择行业标签
                GP.onInit({ father_tag_id: _father_tag_id }) //配置默认父类ID
            } 
               
        }
    }, 

    //必须要登陆以后发起的请求，在这里完成
    onInit: function (options){
        GP.initFatherTag(options) //设置父类
        PRO_PAGE.Init(GP)   //页面基本参数初始化，设置页面名字
        //搜索第一个子标签article_list
        GP.getArticleIndex()  //查询第一个子类的文章
    },


    initFatherTag(options){
        // var _father_tag_id = options.father_tag_id 
        var _matrix = APP.globalData.tagMatrix //从APP获取 tag二维数组
        var _father_tag = PRO_ARTICLE.CheckDefaultFatherTag( //获取要显示的 father标签
            _matrix, //
            options.father_tag_id, //获取目录传入 father_tag_id
            wx.getStorageSync(APP.KEY.FATHER_TAG) //本地已经存储的ID
        )

        //TODO 是否要校验son为 []的情况
        GP.setData({
            sonTagID: _father_tag.son_list[0].tag_id,  //将father的第一个son为默认查询标签
            tagMatrix: _matrix,        //标签二维数组全局化 
            fatherTag: _father_tag, //当前父类标签
            showFatherTagName: _father_tag.tag_name, //显示的行业名字
            showSonTagList: _father_tag.son_list,  //显示的子类名字
        })
        wx.setStorageSync(APP.KEY.FATHER_TAG, _father_tag) //记录当前父类标签
        APP.globalData.title = _father_tag.tag_name
    },

    



    /**
       * 事件
       * 点击标签，获取文章列表
       * arg : e 事件参数
       */
    clickTag(e) {
        var _son_tag_id = e.currentTarget.dataset.tag_id
        GP.setData({
            sonTagID: _son_tag_id,
        })
        PRO_ARTICLE.ClearArticle(GP) //清空文章内容
        GP.getArticleGetListByTag(_son_tag_id)
    },
    
    /**
      * 事件
      * 滚动到底部
      */
    scrollBottom() {
        if( PRO_ARTICLE.CheckScrollLock(GP) ) //通过才能继续查
            GP.getArticleGetListByTag(GP.data.sonTagID)
    },

    /**
     * 初始化
     * 获取页面初始化信息
     * arg: son_tag_id  子类标签ID
     * request: article_list 文章列表
     */
    getArticleIndex() {
        PRO_ARTICLE.RequestIndexByAd(API, GP, GP.data.sonTagID)
    },  

    /**
     * 点击标签 or 下拉刷新
     * arg: son_tag_id  子类标签ID
     * request: article_list 文章列表
     * */
    getArticleGetListByTag(son_tag_id) {
        PRO_ARTICLE.RequestByAd(API, GP, son_tag_id)
    }, 

    /**
     * 进入行业标签选择界面
     */
    toFatherTagChoice() {
        wx.navigateTo({
            url: '/pages/index_bar/index_bar',
        })
    },

    onShareAppMessage: function () { 
        return {
            title: '快讯',
            desc: '简讯、资讯信息',
            path: '/pages/index/index?father_tag_id=' + GP.data.fatherTag.tag_id
        }
    },
})
