// pages/member/member.js

var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GLOBAL_PAGE;


Page({
    data: {
        discount_list: [
            // { member_id: 1, "role_name": 'VIP会员', is_pay: 0, pay_fee: 500 },
            // { order_id: 2, is_pay: 1, pay_fee: 2500 },
            // { order_id: 3, is_pay: 1, pay_fee: 1500 },
        ],
        AGREEMENT_TYPE_MEMBER : 0,
        AGREEMENT_TYPE_SINGLE_TIME: 1,
        AGREEMENT_TYPE_SINGLE_NUMBER: 2,

        filter: "全部优惠券",
    },

    Filter: () => {
        var _itemList = ["全部优惠券", "会员券", "点播券"]
        wx.showActionSheet({
            itemList: _itemList,
            success: function (res) {
                //   console.log(res.tapIndex)
                var _size = 14
                switch (res.tapIndex) {
                    case 0: GLOBAL_PAGE.filterOrder(); break;
                    case 1: GLOBAL_PAGE.filterOrder(GLOBAL_PAGE.data.AGREEMENT_TYPE_MEMBER); break;
                    case 2: GLOBAL_PAGE.filterOrder(GLOBAL_PAGE.data.AGREEMENT_TYPE_SINGLE_TIME); break;
                }
                GLOBAL_PAGE.setData({ filter: _itemList[res.tapIndex] })
            },
        })
    },


    filterOrder: (agreement_type) => {
        var _origin = GLOBAL_PAGE.data.origin_discount_list
        var _order_list = []
        for (var i = 0; i < _origin.length; i++) {
            console.log(_origin[i].agreement_type, GLOBAL_PAGE.data.AGREEMENT_TYPE_MEMBER)
            if (_origin[i].agreement_type == agreement_type || agreement_type == undefined)
                _order_list.push(_origin[i])
        }

        GLOBAL_PAGE.setData({
            discount_list: _order_list
        })
    },

     getMember:function(){
        wx.request
        ({  
                url: API.PAY_GET_LIST_DISCOUNT, 
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
                        discount_list: object.discount_list,
                        origin_discount_list: object.discount_list,
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
        GLOBAL_PAGE.getMember()

    },


})