
// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GLOBAL_PAGE;

Page({
    data: {
        order_list: [],
        origin_order_list:[],//原始订单列表
        AGREEMENT_TYPE_MEMBER : 0,
        AGREEMENT_TYPE_SINGLE_TIME : 1,
        AGREEMENT_TYPE_SINGLE_NUMBER : 2,

        filter:"全部订单",
        ROLE_NORMAL_ID: 1,
        ROLE_VIP_ID: 2,
        ROLE_SUPER_VIP_ID: 3,
        iconVip: '../../images/vip.png',
        iconSuperVip: '../../images/super_vip.png',
    },


    toOrderDetail(){
        wx.navigateTo({
            url: '../order_detail/order_detail',
        })
    },

    getOrder:function(){
        wx.request
        ({  
            url: API.ORDER_GET_ORDER, 
            method:"GET",
            data:{
                session: wx.getStorageSync(KEY.session),
            },
            success: function(res)
            {
                var object = res.data
                if (object.status == "true") //登陆成功
                {
                    GLOBAL_PAGE.setData({
                        order_list: object.order_list,
                        origin_order_list: object.order_list,
                    })
                   

                }
                else{

                }        
            },
            fail:function(res) { 
            },
        })
    },
    //根据id获取节目信息
    onLoad: function (option) {
        // 页面初始化 options为页面跳转所带来的参数
        GLOBAL_PAGE = this
        wx.setNavigationBarTitle({  // 设置当前页面
            title: APP.globalData.title
        })
    },

    onShow: function (option) {
        // 页面初始化 options为页面跳转所带来的参数
        // GLOBAL_PAGE = this

        GLOBAL_PAGE.getOrder()

    },


})