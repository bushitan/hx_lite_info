// pages/together/together.js
var QUERY = require('../../action/query.js');
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var PRO_ARTICLE = require('../../pro/pro_article.js');
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
var YES = 1 ,NO = 0 ,SELF = 2
Page({
    data: {
        YES:YES,
        NO:NO,    

        huan: "Copyright © 2016\n上海熹微网络科技有限公司\n021-68097651  沪ICP备16025177号-1"  ,

        storageArticleList:[],//临时的文章，做筛选用

  },

    //根据id获取节目信息
    onLoad: function (options) {
        GP = this
        QUERY.init(APP, GP)
        console.log(QUERY.getGP())

        //必须要登陆以后再做的事情
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)

    },

    //TODO 增加信息时，全部刷新
    //检测快讯是否已经更换目录
    onShow: function () {
        console.log(QUERY.getGP())
        
        if (APP.globalData.isLogin == true) {  //已经登录
            var _father_tag_id = wx.getStorageSync(APP.KEY.FATHER_TAG).tag_id
            if (parseInt(_father_tag_id) != parseInt(GP.data.fatherTag.tag_id)) {  //检测是否重新选择行业标签
                GP.onInit() //配置默认父类ID
            } 
            if (APP.globalData.isRefreshMatch == true) {
                APP.globalData.isRefreshMatch = false
                GP.onInit() // 临时的，每次都更新
            }
            wx.setNavigationBarTitle({  // 设置当前页面
                title: APP.globalData.title
            })
        }
    },
    onInit: function (options) {
        var _matrix = APP.globalData.tagMatrix //获取 标签矩阵
        var _father_tag = wx.getStorageSync(APP.KEY.FATHER_TAG)

        //初始化各参数
        GP.setData({
            fatherTag: _father_tag,
            showDialog:false, //显示子标签选择提示框
            // showSonTagName: _father_tag.match_list[0].tag_name,
            filter: "供/求",
            userID: APP.globalData.user_id, //设置用户ID
        })

        PRO_PAGE.Init(GP)   //设置页面名字
        GP.initSonTag() //初始化子标签

    },

    //检测父标签含有子标签
    checkHasSonTag(match_list,check_son_tag_id ){
        for (var i = 0; i < match_list.length;i++){
            if (match_list[i].tag_id == check_son_tag_id )
                return true
        }
        return false
    },
    //初始化子标签
    initSonTag(){
        var _father_tag = GP.data.fatherTag
        var _son_tag = wx.getStorageSync(APP.KEY.MATCH_SON_TAG)
        if (_son_tag == "") {  //第一次进入，不存在，将tag保存本地
            _son_tag = _father_tag.match_list[0]
            wx.setStorageSync(APP.KEY.MATCH_SON_TAG, _son_tag)
        }
        //检测，当前son是否在father中,换了新栏目,重新赋值son_tag
        var _has_son = GP.checkHasSonTag(_father_tag.match_list, _son_tag.tag_id)
        if (_has_son == false) {
            _son_tag = _father_tag.match_list[0]
            wx.setStorageSync(APP.KEY.MATCH_SON_TAG, _son_tag)
        }
        GP.setData({
            sonTag: _son_tag,
            showSonTagName:_son_tag.tag_name,
        })
        GP.getMatchListByTag(_son_tag.tag_id) //按子标签默认标签搜索

    },


    /**
     * 查询 match_list  根据tag
     * 唯一变动的地方
     */
    getMatchListByTag(tag_id) {
        PRO_ARTICLE.RequestByTag(API, GP, API.MATCH_GET_LIST_TAG ,tag_id)
    },


    /**
     * 查询 match_list  根据tag,用户的动作，供，求，我的
     */
    getMatchListByTagChoice(tag_id,action) {
        PRO_ARTICLE.RequestByMatchChoice(API, GP, API.MATCH_GET_LIST_TAG, tag_id, action)
    },

    /**
     * 滚动条事件
     * 刷新列表
     */
    scrollBottom(e) {
        if (PRO_ARTICLE.CheckScrollLock(GP)) //通过才能继续查
            GP.getMatchListByTag(GP.data.sonTag.tag_id) //根据father.tag_id 查供求信息

    },
    // 子类产品更换
    sonChange(e){
      var son_tag = GP.data.fatherTag.match_list[e.detail.value]
      wx.setStorageSync(APP.KEY.MATCH_SON_TAG, son_tag)
      GP.setData({
        showSonTagName: son_tag.tag_name,  //设置右上角显示名称
        sonTag: son_tag,  //把标签统一
      })
      PRO_ARTICLE.ClearArticle(GP) //清当前信息内容
      GP.getMatchListByTag(son_tag.tag_id)   //按子id查询
    },

    //点击拨号按钮
    phoneMatch(e){
        var _check = APP.checkMember()  //检测
        if (_check == false) {
            wx.showModal({
                title: '温馨提示',
                content: '成为' + wx.getStorageSync(APP.KEY.FATHER_TAG).tag_name + '会员能够拨打电话',
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
        var phone = e.currentTarget.dataset.phone
        // console.log(_match_id)
        wx.makePhoneCall({
            phoneNumber: phone //仅为示例，并非真实的电话号码
        })
    },


    //模态框提示用户删除
    deleteMatchModal(e){
        var _match_id = e.currentTarget.dataset.match_id
        wx.showModal({
            title: '提示',
            content: '数据删除将无法恢复，请确认',
            confirmText:"确认删除",
            success:function(res){
                if (res.confirm) {
                    GP.deleteMatch(_match_id)
                } else if (res.cancel) {
                }
            },
        })
    },


    //确认删除
    deleteMatch(match_id){

        API.Request({
            "url": API.MATCH_DELETE_SELF,
            "data":{
                match_id: match_id,
            },
            "success":function(res){
                var object = res.data
                // GP.getMatchListByTagChoice(GP.data.sonTag.tag_id, SELF) 
             
                PRO_ARTICLE.ClearArticle(GP) //清空文章内容
                GP.getMatchListByTag(GP.data.sonTag.tag_id) 
               
                wx.showModal({
                    title: '删除成功',
                    content: '您发布的信息已经删除，可点击右下方 “+” 发布供求信息拟',
                    showCancel: false,
                })

            },

        })
        // wx.request
        //     ({
        //         url: API.MATCH_DETELE_BY_ID_USER,
        //         method: "GET",
        //         data: {
        //             session: wx.getStorageSync(KEY.session),
        //             match_id: match_id,
        //         },
        //         success: function (res) {
        //             var object = res.data
        //             wx.showModal({
        //                 title: '删除成功',
        //                 content: '您发布的信息已经删除，可点击右下方 “+” 发布供求信息拟',
        //                 showCancel: false,
        //             })
        //         },
        //         fail: function (res) {
        //         },
        //     })
    },



    addNews(){
        var _check = APP.checkMember()  //检测
        if (_check == false) {
            wx.showModal({
                title: '温馨提示',
                content: '成为' + wx.getStorageSync(APP.KEY.FATHER_TAG).tag_name + '会员能够发布供求信息',
                confirmText: '成为会员',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url:"../pay/pay"
                        })
                    }
                }
            })
            return
        }
        wx.navigateTo({
            url: '../match_input/match_input',
        })
    },

    //筛选历史记录
    choiceFilter:function(){
      
        wx.showActionSheet({
            itemList: ["供/求","供应","求购","我的"],
            success: function (res) {

                PRO_ARTICLE.ClearArticle(GP) //清空文章内容
                switch (res.tapIndex) {
                    case 0: 
                        GP.getMatchListByTag(GP.data.sonTag.tag_id)
                        break;
                    case 1: 
                        GP.getMatchListByTagChoice(GP.data.sonTag.tag_id,NO)                       
                        break;
                    case 2:                     
                        GP.getMatchListByTagChoice(GP.data.sonTag.tag_id, YES)
                        break;
                    case 3: 
                        GP.getMatchListByTagChoice(GP.data.sonTag.tag_id, SELF)                       
                        break;                        
                }
                
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
  },
  
    scroll1Bottom1() {
        var data = GP.data
        if (data.is_srcoll_lock == false
            && data.has_more == true
        ) {
            var _page_num = data.page_num

            console.log('滑动到底部')
            if (data.has_more == true) {
                GP.setData({
                    page_num: _page_num + 1,
                    is_srcoll_lock: true,
                })
                GP.filterTrace(GP.data.pay_mode)
            }
        }
    },

//   onShareAppMessage: function () { 
    //   return {
    //       title: '叮叮看电视',
    //       desc: '百万部视频，叮叮立即看',
    //       path: '/pages/ware_out/ware_out?id=' + GP.data.id
    //   }
//   },

})