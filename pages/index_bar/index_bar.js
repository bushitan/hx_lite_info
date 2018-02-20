// pages/index_bar/index_bar.js
var PRO_ARTICLE = require('../../pro/pro_article.js');
var APP = getApp()
var GP;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tagFatherList:""
    },

    toIndex(e) {
        // wx.setStorageSync(APP.KEY.INDEX_FATHER_TAG_ID, e.currentTarget.dataset.tag_id)
        var _matrix = APP.globalData.tagMatrix //从APP获取 tag二维数组
        var _father_tag = PRO_ARTICLE.CheckDefaultFatherTag( //获取要显示的 father标签
            _matrix,
            e.currentTarget.dataset.tag_id,
            '',
        )
        wx.setStorageSync(APP.KEY.FATHER_TAG, _father_tag)
        // wx.setStorageSync(APP.KEY.INDEX_IS_RESET_TAG, true)
        // wx.setStorageSync(APP.KEY.MATCH_IS_RESET_TAG, true)
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // var _index_tag_id = wx.getStorageSync(APP.KEY.INDEX_TAG_ID)
        // if (_index_tag_id != ""){
        //     wx.switchTab({
        //         url: '/pages/index/index'
        //     })
        //     return
        // }
        // 页面初始化 options为页面跳转所带来的参数
        GP = this
        var res = wx.getSystemInfoSync()
        GP.setData({
            windowHeight: res.windowHeight
        })
        wx.setNavigationBarTitle({  // 设置当前页面
            title: "选择行业"
        })
        // //   GP.init()
        //     //必须要登陆以后再做的事情
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)

    },
    //必须要登陆以后发起的请求，在这里完成
    onInit: function (options) {
        //同步tagMatrix
        GP.setData({
            tagFatherList: APP.globalData.tagFatherList
        })
    }

    
})