var GP
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var WxParse = require('../../wxParse/wxParse.js');

var FONT_SIZE_LIST = "font_size_list"
var FONT_SIZE = "font_size"

var ROLE_LEVEL_1 = 1,
    ROLE_LEVEL_2 = 2,
    ROLE_LEVEL_3 = 3
Page({
  data: {
    SHOW:1,
    HIDDEN:0,

    art:[],
    // isLock: "0", //充值权限控制


    fontSize:18,

    //音频
    audio_poster: '',
    audio_name: '',
    audio_author: '',
    audio_src: '',

    //视频
    video_src:"",

    canUseRichText: true,

    next:{ is_next: false }, //next 默认没有下一栏

  },
  
 
  /**
   * 直接跳转到支付页面
   */
  dialogMember(role_value, article_id) {
      var _str
      if (role_value == ROLE_LEVEL_3)
          _str = "超级VIP会员"
      else
          _str = "VIP会员"
      wx.showModal({
          title: '温馨提示',
          content: '成为' + wx.getStorageSync(APP.KEY.FATHER_TAG).tag_name + '"' + _str + '"' + '能够浏览',
          cancelText:"去首页",
          confirmText: '成为会员',
          success: function (res) {
              if (res.confirm) {
                  // console.log('去pay页面')
                //   wx.navigateTo({
                //       url: '../pay/pay?article_id=' + article_id
                //     })
                  wx.redirectTo({
                      url: '../pay/pay?article_id=' + article_id
                  })
              }
              else {
                  wx.switchTab({
                      url: '../index/index',
                  })
              }

          },
          complete:function(res){
            
          }
      })
  },


  /**
   * 点击文章
   */
  checkArticle: function (article) {
      var article_id = article.article_id
      var _role_value = article.role_value
      if (_role_value > ROLE_LEVEL_1) { //当不是普通文章
          if (APP.checkMember(_role_value) == false) {  //如果会员不满足
              API.Request({
                  'url': API.ARTICLE_CHECK_SINGLE,
                  'data': {
                      'article_id': article_id,
                  },
                  success: function (res) {
                      if (res.data.is_single)
                        return
                        //   GP.toArticle(article_id)
                      else
                          GP.dialogMember(_role_value, article_id)
                  },
              })

              return
          }
      }

    //   GP.toArticle(article_id)
  },
  
  //获取文章内容
  getArticleContent: function (article_id) {
      console.log(API.ARTICLE_GET_ID)
      console.log(article_id)
       wx.request
        ({  
            url: API.ARTICLE_GET_ID, 
            method:"GET",
            data: {
                session: wx.getStorageSync(KEY.session),
                article_id: article_id,
            },
        success: function(res)
        {
            var object = res.data

            var _article_dict = object.article_dict


            //检查，是否有权限：
            if (GP.data.share)
                GP.checkArticle(_article_dict)

            GP.setData({
                article: _article_dict
            })

            if ( _article_dict.content.indexOf("table") < 0)
                GP.setData({ useRichText: false })
            else
                if (GP.data.canUseRichText == true)
                    GP.setData({ useRichText: true })
                else{
                    GP.setData({ useRichText: false })
                    wx.showModal({
                        title: '温馨提示',
                        content: '当前微信版本过低，表格可能显示不完整，请升级微信到最新版本',
                        showCancel: false,
                        confirmText: "朕知道了",
                    })
                }
                //

                // if ( GP.data.canUseRichText == false &&
                //     _article_dict.content.indexOf("table") >= 0
                // )
                //     wx.showModal({
                //         title: '温馨提示',
                //         content: '当前微信版本过低，表格可能显示不完整，请升级微信到最新版本',
                //         showCancel: false,
                //         confirmText: "朕知道了",
                //     })

                // var article = '<div>我是HTML代码</div>';
                var _article = '<div>' + _article_dict.content + '</div>';
                var _article = _article_dict.content ;
                /**
                * WxParse.wxParse(bindName , type, data, target,imagePadding)
                * 1.bindName绑定的数据名(必填)
                * 2.type可以为html或者md(必填)
                * 3.data为传入的具体数据(必填)
                * 4.target为Page对象,一般为this(必填)
                * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
                */
                var that = this;
                WxParse.wxParse('article_content', 'html', _article, GP, 5);
                wx.hideToast()
        },
        fail:function(res) { 
            wx.showModal({
                title: '提示',
                content: '文章获取失败，请稍后尝试',
                showCancel:false,
                confirmText:"退出",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateBack({ })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        },
        })
  },


  fontSizeSwitch: function () {
      wx.showActionSheet({
          itemList: GP.data.fontSizeList,
          success: function (res) {
              //   console.log(res.tapIndex)
              switch (res.tapIndex) {
                  case 0:  GP.changeFontSize(22); break;
                  case 1:  GP.changeFontSize(18);break;
                  case 2:  GP.changeFontSize(14);break;
              }
          },
          fail: function (res) {
              console.log(res.errMsg)
          }
      })
  },
    changeFontSize(fontSize){
        var fontSizeList
        if (fontSize == 22)
            fontSizeList = ['大 ●', '中 ○ ', '小 ○']
        else if (fontSize == 18)
            fontSizeList = ['大 ○', '中 ● ', '小 ○']
        else
            fontSizeList = ['大 ○ ', '中 ○', '小 ●']

        GP.setData({ 
            fontSizeList: fontSizeList,
            fontSize: fontSize
        })
        wx.setStorageSync(FONT_SIZE_LIST, fontSizeList)
        wx.setStorageSync(FONT_SIZE, fontSize)
    },

    initFontSize(){
        var fontSizeList = wx.getStorageSync(FONT_SIZE_LIST)
        var fontSize = wx.getStorageSync(FONT_SIZE)

        if (fontSizeList == "")
            fontSizeList = ['大 ○ ', '中 ● ', '小 ○']
        if (fontSize == "")
            fontSize = 18
        GP.setData({
            fontSizeList: fontSizeList,
            fontSize: fontSize
        })

    },

    toIndex(){
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log(options)

    var that = this
    GP = this

    //分享路径
    var share = false
    if (options.hasOwnProperty("share") )
        share = true
    GP.setData({
        share:share
    })

    GP.initFontSize()

    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 8000
    })

    try{
        GP.setData({
            canUseRichText:wx.canIUse('rich-text')
        })
    }
    catch (e) {
        GP.setData({
            canUseRichText: false
        })
    }

    if (APP.globalData.isLogin == true)
        GP.onInit(options)
    else
        APP.login(options)
  },
    onInit: function (options) {

        var art_id = parseInt(options.art_id) //保存文章编号

        //初始化下一篇文章内容
        var artList = wx.getStorageSync("current_article_list")
        var next = {is_next:false}
        for(var i = 0;i<artList.length-1;i++){
            if (art_id == artList[i].article_id)
                if (i < artList.length-1)
                    next = { 
                        is_next: true,
                        article_id: artList[i + 1].article_id,
                        article_title: artList[i+1].title,
                    }
        }

        GP.setData({
            articleID: art_id,
            next: next,
        })
        GP.getArticleContent(art_id)
    },

    nextClick(){
        //相当于重新onload一次
        var _next = GP.data.next
        var art_id = _next.article_id
        var artList = wx.getStorageSync("current_article_list")
        var next = { is_next: false }
        for (var i = 0; i < artList.length - 1; i++) {
            if (art_id == artList[i].article_id)
                if (i < artList.length - 1)
                    next = {
                        is_next: true,
                        article_id: artList[i + 1].article_id,
                        article_title: artList[i+1].title,
                    }
        }

        GP.setData({
            articleID: art_id,
            next: next,
        })
        GP.getArticleContent(art_id)
    },



  onShareAppMessage: function () { 
      return {
          title: GP.data.article.title,
          desc: GP.data.article.subtitle,
          path: '/pages/detail/detail?art_id=' + GP.data.articleID +"&share=1" ,
      }
   },

})