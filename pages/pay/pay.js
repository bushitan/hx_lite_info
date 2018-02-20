
var GP
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
// var KEY = require('../../action/action_pay.js');

var STYLE_ORDER_MEMBER = 0
var STYLE_ORDER_SINGLE = 1

Page({
    data: {
        //显示支付订单
        //订单模式
        styleOrder: "",
        STYLE_ORDER_MEMBER: STYLE_ORDER_MEMBER, //会员订单
        STYLE_ORDER_SINGLE: STYLE_ORDER_SINGLE, //点播订单


        isPayBtnDisable: false,
        showProcotol: false,
        

        roleIndex:0, //选择下标
        roleList: [], //角色选择列表
        fatherTag: "",  //父类标签
        showSingleBtn:false, //默认不显示点播按钮
        vipRole:{},  //VIP会员角色信息
        superVipRole:{}, //超级会员角色信息

        showOrder: false, //支付订单页面，
        orderDict:{} ,//职业订单详情
        discountList:[], //优惠券列表
    },
    onLoad: function (options) {
        GP = this
        var _father_tag = wx.getStorageSync(APP.KEY.FATHER_TAG) 
        var articleID = ""
        if (options.hasOwnProperty("article_id"))
            articleID = options.article_id
        GP.setData({
            fatherTag: _father_tag,
            articleID: articleID,
        })
        wx.setNavigationBarTitle({  // 设置当前页面
            title: _father_tag.tag_name
        })
        //必须要登陆以后再做的事情
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)

    },

    /**
     *  进入渠道：
     * 1 、 文章进入，有点播
     * 2、 供求、花名册、会员，没有点播
     */
    onInit: function (options) {
        
        API.Request({
             'url': API.PAY_GET_TAG,
             'data':{
                 "tag_id": GP.data.fatherTag.tag_id,
             },
             'success':function(res){
                var object = res.data
                GP.setData({
                    roleList:object.role_list,
                    roleIndex:0,
                    vipRole: object.vip_role,
                    superVipRole: object.super_vip_role,
                    showSingleBtn: object.show_single_btn,
                    // showSingleBtn: true,
                })
             },
         })
    },

    //选择会员等级
    bindPickTag(e) {
        var _value = e.detail.value
        GP.setData({
            roleIndex: _value,
        })
    },


    /**
     * 事件
     * 点击： 会员支付按钮
     * return： order ， discount_list
     */
    clickMember: function (e) {
        var roleIndex = GP.data.roleIndex
        var roleList = GP.data.roleList
        var fatherTag = GP.data.fatherTag
        API.Request({
            'url': API.PAY_CREATE_ORDER,
            'data': {
                is_member_order: true,
                tag_id: fatherTag.tag_id,
                role_id: roleList[roleIndex].role_id,
            },
            success: function (res) {
                var object = res.data
                GP.setData({
                    orderDict: object.order_dict,
                    discountList: object.discount_list,
                    showOrder: true,
                    styleOrder: STYLE_ORDER_MEMBER,
                    discountIndex: 0, //优惠券选择下标
                })
            }
        })
    },

    clickSingle(e){
        var data = {
            is_member_order: true,
            article_id: GP.data.articleID,
        }
        API.Request({
            'url': API.PAY_CREATE_ORDER,
            'data': {
                is_member_order: false,
                article_id: GP.data.articleID,
            },
            success: function (res) {
                var object = res.data
                GP.setData({
                    orderDict: object.order_dict,
                    discountList: object.discount_list,
                    showOrder: true,
                    styleOrder: STYLE_ORDER_SINGLE,
                    discountIndex: 0, //优惠券选择下标
                    articleTitle: object.article_title, //点播的文章列表
                })
            }
        })
    },

    /**
     * 事件
     * 返回按钮
     */
    toBack: function () {
        console.log(GP.data.articleID)
        if (GP.data.articleID == "")
            wx.navigateBack({
            })
        else
            wx.switchTab({
                url: '../index/index',
            })
    },


    /**
     * 点击确认支付
     */
    clickCreateOrder(){
        var _order_id = GP.data.orderDict.order_id
        var _discount_list = GP.data.discountList
        var _discount_index = GP.data.discountIndex
        var _discount_id = ""
        if (_discount_list.length > 0)
            _discount_id = _discount_list[_discount_index].discount_id
       
        console.log(_order_id,_discount_id)
        GP.setData({ isPayBtnDisable: true })
        API.Request({
            'url': API.PAY_CONFIRM_ORDER,
            'data': {
                order_id: _order_id,
                discount_id: _discount_id,
            },
            success: function (res) {
                var object = res.data
                console.log(object)

                if (object.is_zero == true)
                    GP.paySuccess()   //0元支付，直接提示成功
                else
                    GP.wxPay(object) //微信支付，调取支付接口
            },
            complete:function(res){
                GP.setData({ isPayBtnDisable: false })
            },
        })
    },

    /**
     * 支付成功
     */
    paySuccess(){
        wx.hideLoading()
        wx.showToast({
            title: '支付成功',
            success: function () {
                APP.login()
                setTimeout(
                    function () {
                            // wx.navigateBack()
                      
                        GP.toBack()
                    },
                    1500, )
            },
        })
    },

    /**
     * 支付失败
     */
    payFail() {
        wx.hideLoading()
        wx.showModal({
            title: '微信支付提示',
            content: '支付已取消，若出现微信支付不成功的问题，请联系管理员',
            showCancel:false,
        })
    },


    /**
     * 调取微信支付api
     */ 
    wxPay(object){
        wx.showLoading({
            title: '支付中',
        })
        wx.requestPayment({
            'timeStamp': object.timeStamp,
            'nonceStr': object.nonceStr,
            'package': object.package,
            'signType': 'MD5',
            'paySign': object.paySign,
            'success': function (res) {
                console.log(res)
                GP.paySuccess()
            },
            'fail': function (res) {
                console.log(res)
                GP.payFail()
            }
        })
    },




    //打钩，同意协议
    bindProtocolChange(e){
        // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        console.log(e.detail.value.length)
        if (e.detail.value.length == 0)
            GP.setData({ isPayBtnDisable: true })
        else
            GP.setData({ isPayBtnDisable: false })
    },

    //跟后台要对应行业的协议内容
    openProtocol() {
        wx.showLoading({
            title: '获取协议中',
        })
        API.Request({
            'url': API.PAY_GET_PROTOCOL,
            'data': {
                "tag_id": GP.data.fatherTag.tag_id,
            },
            'success': function (res) {
                var object = res.data
                GP.setData({
                    procotolDict: object.protocol_dict,
                })
            },
            'complete':function(res){
                wx.hideLoading()
            }
        })
        GP.setData({
            showProcotol:true,
        })
    },
    closeProtocol() {
        GP.setData({ showProcotol: false })
    },
    
    // 2.4 关闭优惠券
    closeDiscount: function () {
        GP.setData({
            showOrder: false,
        })

    },
})