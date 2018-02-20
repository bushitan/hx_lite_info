'use strict';

var API = require('../../utils/api.js');
var GLOBAL_PAGE
var SESSION = "session"

var article_id = ""
//this 钩子    
function Init(page,options){
    GLOBAL_PAGE = page

    var _article_id = options.art_id
    if (_article_id == undefined)
        _article_id = ""
    GLOBAL_PAGE.setData({
        artId: _article_id,
    })
}

//page页面显示
var Page = {
    // 页面生成
    Init:()=>{
        wx.request
        ({
            url: API.ORDER_PAYMENT_PAGE,
            method: "GET",
            data: {
                session: wx.getStorageSync(SESSION),
                article_id: GLOBAL_PAGE.data.artId,
            },
            success: function (res) {
                var object = res.data
                if (object.status == "true") //登陆成功
                {
                    if (object.is_order == "true") //从订单页面进入,没有点播
                    {
                        GLOBAL_PAGE.setData({
                            // showMethod: object.permission_member, //支付显示页面模式
                            isFromOrder: true,
                            vipPrice: object.vip_price,
                            superVipPrice: object.super_vip_price,
                            member_pick_range: object.member_pick_range,

                            
                        })
                    }                    
                    if (object.is_allow == "true") //文章可以浏览，跳转至文章
                    { 
                        wx.redirectTo({
                            url: '../detail/detail?art_id=' + object.article_id,
                        })
                        return 
                    }
                    else //点播订单
                        GLOBAL_PAGE.setData({
                            showMethod: object.permission_member, //支付显示页面模式
                            permissionMember: object.permission_member,//支付的权限
                            vipPrice: object.vip_price,
                            superVipPrice: object.super_vip_price,
                            article_title: object.article_title,
                            single_price: object.single_price,
                            member_pick_range: object.member_pick_range,
                        })
                    //两层选择框
                    Page.InitPick(object.member_pick_range)
                    // Page._createPick()
                }
                else {

                }
            },
            fail: function (res) {
            },
        })
    },

    InitPick(member_pick_range){
        var memberRange = ["请选择网站"]
        for (var i = 0; i < member_pick_range.length; i++) {
            memberRange.push(member_pick_range[i].tag_name)
        }
        GLOBAL_PAGE.setData({
            memberIndex: 0,
            memberRange: memberRange,
            tagIndex: 0,
            tagRange: ["请先选择网站"],
        })
    },


    //11111111 TODO 这里有问题，不懂
    _createPick: () => { 
        var memberObject = GLOBAL_PAGE.data.member_pick_range
        var multiIndex = [0, 0]
        // 初始化 设置第一列，标签列
        var colum_0 = []
        for (var i = 0; i < memberObject.length; i++)
            colum_0.push(memberObject[i].tag_name)

        // 初始化 设置第二列，会员等级列
        var colum_1 = []
        for (var j = 0; j < memberObject[0].list.length; j++)
            colum_1.push(memberObject[0].list[j].role_name)
        var _multiArray = []
        _multiArray.push(colum_0)
        _multiArray.push(colum_1)
        GLOBAL_PAGE.setData({
            multiArray: _multiArray,
            multiIndex: multiIndex,
            selectTagRole: {
                "tag_id": memberObject[multiIndex[0]].tag_id,
                "tag_name": memberObject[multiIndex[0]].tag_name,
                "role_id": memberObject[multiIndex[0]].list[multiIndex[1]].role_id,
                "role_name": memberObject[multiIndex[0]].list[multiIndex[1]].role_name,
            }
        })
    },
    // 改变tag和role 的值
    ChangeTagRole: () => { 
        var memberObject = GLOBAL_PAGE.data.member_pick_range
        var multiIndex = GLOBAL_PAGE.data.multiIndex
        GLOBAL_PAGE.setData({
            selectTagRole: {
                "tag_id": memberObject[multiIndex[0]].tag_id,
                "tag_name": memberObject[multiIndex[0]].tag_name,
                "role_id": memberObject[multiIndex[0]].list[multiIndex[1]].role_id,
                "role_name": memberObject[multiIndex[0]].list[multiIndex[1]].role_name,
            }
        })
    },
    GetSelectTagRole: () => {
        return GLOBAL_PAGE.data.selectTagRole
    },

}

// 预备订单创建
var PreOrder = {
    GetPreSingleOrder:()=>{
        wx.request
        ({
            url: API.ORDER_PRE_SINGLE,
            method: "GET",
            data: {
                session: wx.getStorageSync(SESSION),
                article_id: GLOBAL_PAGE.data.artId,
            },
            success: function (res) {
                var object = res.data
                if (object.status == "true") //登陆成功
                {
                    GLOBAL_PAGE.setData({
                        order_info: object.order_info,
                        discount_list: object.discount_list,
                    })
                    PreOrder.InitDiscount(
                        object.order_info,
                        object.discount_list
                    )
                }
                else {
                }
            },
            fail: function (res) {
            },
        })
    },
    // 获取预备会员订单
    GetPreMemberOrder: (tag_id,role_id) =>{
        wx.request
        ({
            url: API.ORDER_PRE_MEMBER,
            method: "GET",
            data: {
                session: wx.getStorageSync(SESSION),
                tag_id:tag_id,
                role_id:role_id,
            },
            success: function (res) {
                var object = res.data
                if (object.status == "true") //登陆成功
                {
                    GLOBAL_PAGE.setData({
                        order_info: object.order_info,
                        discount_list: object.discount_list,
                    })
                    PreOrder.InitDiscount(
                        object.order_info,
                        object.discount_list
                    )
                }
                else {
                }
            },
            fail: function (res) {
            },
        })
    },

    // 初始化预备订单，含优惠券计算
    InitDiscount: (order_info,discount_list) => { 
        var discount_list = discount_list
        var _index = 0      // 优惠券pick索引        
        var _name_list = [] // 优惠券pick展示名字，最后一项为不使用优惠券
        var _original_fee = order_info.original_fee  //原价
        if (discount_list.length > 0) { //初始化优惠券，以第一张为主
            var _payment_fee = _original_fee - discount_list[0].fee //优惠的价格
            var _pick_discount_id = discount_list[0].discount_id //选择优惠券的id
            for (var i = 0; i < discount_list.length; i++)
                _name_list.push(discount_list[i].name)
            _name_list.push('不使用优惠券')
        } else {
            var _payment_fee = _original_fee  //无有优惠券
            var _pick_discount_id = ""//未选择优惠券
            _name_list.push('没有优惠券')
        }
        _payment_fee = _payment_fee > 0 ? _payment_fee : 0
        GLOBAL_PAGE.setData({
            showOrder: true, // 初始化成功 ，打开支付、优惠券页面
            pre_order: { //预备订单
                order_id: order_info.order_id,
                // tag_name: order_info.tag_name,
                // role_name: order_info.role_name,
                original_fee: _original_fee,
                payment_fee: _payment_fee,
                discount_list: discount_list,
                discount_name_list: _name_list,
                discount_index: _index, //
                pick_discount_id: _pick_discount_id, //选择的优惠券id
            }
        })
    },
    // 选择优惠券
    ChangeDiscount: (index) => { 
        var _index = parseInt(index) //强制把索引转为int
        var _pre_order = GLOBAL_PAGE.data.pre_order
        var _discount_list = GLOBAL_PAGE.data.pre_order.discount_list
        
        if (_index < _discount_list.length) {
            var _pick_discount_id = _discount_list[_index].discount_id
            //选择别的优惠券
            var _payment_fee = _pre_order.original_fee - _discount_list[_index].fee 
        }
        else {
            var _pick_discount_id = ""
            var _payment_fee = _pre_order.original_fee  //无有优惠券

        } 

        _payment_fee = _payment_fee > 0 ? _payment_fee : 0
        _pre_order.discount_index = _index //更新预备订单 优惠券索引
        _pre_order.pick_discount_id = _pick_discount_id //更新当前选择的优惠券id
        _pre_order.payment_fee = _payment_fee //更新支付价格
        GLOBAL_PAGE.setData({
            pre_order: _pre_order
        })
    },
    // 获取预备订单数据
    GetPreOrder:() => { 
        var _pre_order =  GLOBAL_PAGE.data.pre_order
        return _pre_order
    },

    // 确认订单
    // 成功，调用微信支付
    ComfirmMember:(order_id,discount_id)=>{
        wx.request
        ({
            url: API.ORDER_COMFIRM_MEMBER,
            method: "GET",
            data: {
                session: wx.getStorageSync(SESSION),
                order_id: order_id,
                discount_id: discount_id,
            },
            success: function (res) {
                var object = res.data
                if (object.status == "true") //登陆成功
                {
                    if ( object.is_zero == "true" )
                        Order.PaymentSuccess()
                    else
                        Order.WxPayment(object)
                }
                else {
                }
            },
            fail: function (res) {
            },
        })
    },
}

// //优惠券
// var Discount = {
//     // init: function (page) {
//     //     GLOBAL_PAGE = page
//     // },
//     Change:()=>{

//     },
//     // 会员折扣券
//     Member: function(){

//         // 优惠券数据组
//         var discount_list = [
//             {
//                 'id':1,
//                 'name': "10块优惠券",
//                 'fee': 10,
//             },
//             {
//                 'id': 2,
//                 'name': "5块优惠券",
//                 'fee': 5,
//             },
//         ]
//         var _index = 0      // 优惠券pick索引        
//         var _name_list = [] // 优惠券pick展示名字，最后一项为不使用优惠券
//         var origig_fee = 800  //原价
//         if (discount_list.length > 0){ //初始化优惠券，以第一张为主
//             var payment_fee = origig_fee - discount_list[0].fee //优惠的价格
//             var pick_discount_id = discount_list[0].id //选择优惠券的id
//             for (var i = 0; i < discount_list.length; i++)
//                 _name_list.push(discount_list[i].name)
//             _name_list.push('不使用优惠券')
//         } else {
//             var payment_fee = origig_fee  //无有优惠券
//             var pick_discount_id = ""//未选择优惠券
//             _name_list.push('没有优惠券')
//         }


//         GLOBAL_PAGE.setData({
//             showOrder: true, //打开支付、优惠券页面
//             pre_order:{ //预备订单
//                 title: "会员支付",
//                 tag: {
//                     tag_id: 1,
//                     tag_name: "松香网"
//                 },
//                 role: {
//                     role_id: 2,
//                     role_name: "VIP会员"
//                 },
//                 origig_fee: origig_fee,
//                 payment_fee: payment_fee,
//                 discount_list: discount_list,
//                 discount_name_list: _name_list,
//                 discount_index: _index,
//             }
//         })


        
//         // wx.request
//         // ({
//         //     url: API.ORDER_GET_DISCOUNT,

//         //     // url: API.ORDER_PRE_MEMBER,
//         //     method: "GET",
//         //     data: {
//         //         session: wx.getStorageSync(SESSION),
//         //         article_id: GLOBAL_PAGE.data.artId,
//         //     },
//         //     success: function (res) {
//         //         var object = res.data
//         //         if (object.status == "true") //登陆成功
//         //         {
//         //            GLOBAL_PAGE.setData({
//         //                discount_list:object.discount_list
//         //            })
//         //         //    Discount.ChoiceDiscount(object.discount_list)
//         //            Discount.GetMemberPrice(object.discount_list)
//         //         }
//         //         else {

//         //         }
//         //     },
//         //     fail: function (res) {
//         //     },
//         // })
//     },
//     Single: function (){
//         //TODO 获取点播的优惠券

   

//         // wx.request
//         // ({
//         //     url: API.ORDER_GET_DISCOUNT,
//         //     method: "GET",
//         //     data: {
//         //         session: wx.getStorageSync(SESSION),
//         //         article_id: GLOBAL_PAGE.data.artId,
//         //     },
//         //     success: function (res) {
//         //         var object = res.data
//         //         if (object.status == "true") //登陆成功
//         //         {
//         //             GLOBAL_PAGE.setData({
//         //                 showOrder: true, //打开支付、优惠券页面
//         //                 discount_list: object.discount_list
//         //             })
//         //             // Discount.ChoiceDiscount(object.discount_list)
//         //             Discount.GetSinglePrice(object.discount_list)
//         //         }
//         //         else {

//         //         }
//         //     },
//         //     fail: function (res) {
//         //     },
//         // })
//     },
//     GetMemberPrice:(discount_list)=>{
//         GLOBAL_PAGE.setData({
//             showOrder: true,
//             isMemberDiscount:true,
//         })

//         var _discount_list = discount_list
//         var _name_list = []
//         var _discount_price = 0
//         if (_discount_list.length == 0)
//             _name_list.push('没有优惠券')
//         else {
//             for (var i = 0; i < _discount_list.length; i++) {
//                 _name_list.push(_discount_list[i].name)
//             }
//             _name_list.push('不使用优惠券')
//             _discount_price = _discount_list[0].fee
//         }
//         GLOBAL_PAGE.setData({
//             discount_name_list: _name_list,
//             discountIndex:0,
//         })
//         // discount_list
//         //根据权限设置价格
//         var _index = GLOBAL_PAGE.data.roleIndex
//         var _role_id = GLOBAL_PAGE.data.role_id_list[_index]
//         var _origin_price

//         if (_role_id == 3)
//             _origin_price = GLOBAL_PAGE.data.superVipPrice
//         else
//             _origin_price = GLOBAL_PAGE.data.vipPrice
//         var _pay_price = parseInt(_origin_price) - parseInt(_discount_price)
//         GLOBAL_PAGE.setData({
//             origin_price: _origin_price,
//             pay_price: _pay_price,
//         })
        
//     },

//     GetSinglePrice: (discount_list)=>{
//         GLOBAL_PAGE.setData({
//             showOrder: true,
//             isMemberDiscount: true,
//         })

//         var _discount_list = discount_list
//         var _name_list = []
//         var _discount_price = 0
//         if (_discount_list.length == 0)
//             _name_list.push('没有优惠券')
//         else {
//             for (var i = 0; i < _discount_list.length; i++) {
//                 _name_list.push(_discount_list[i].name)
//             }
//             _name_list.push('不使用优惠券')
//             _discount_price = _discount_list[0].fee
//         }
//         GLOBAL_PAGE.setData({
//             discount_name_list: _name_list,
//             discountIndex: 0,
//         })
//         // discount_list
//         //根据权限设置价格
//         var _index = GLOBAL_PAGE.data.roleIndex
//         var _role_id = GLOBAL_PAGE.data.role_id_list[_index]
//         var _origin_price

//         // if (_role_id == 3)
//         //     _origin_price = GLOBAL_PAGE.data.PAY_PRICE_3500
//         // else
//         //     _origin_price = GLOBAL_PAGE.data.PAY_PRICE_800
//         _origin_price = GLOBAL_PAGE.data.single_price
//         var _pay_price = parseInt(_origin_price) - parseInt(_discount_price)
//         GLOBAL_PAGE.setData({
//             origin_price: _origin_price,
//             pay_price: _pay_price,
//         })
//     },

// }


var Order = {
    // 调用微信接口支付
    WxPayment: (object)=>{
        wx.requestPayment({
            'timeStamp': object.timeStamp,
            'nonceStr': object.nonceStr,
            'package': object.package,
            'signType': 'MD5',
            'paySign': object.paySign,
            'success': function (res) {
                console.log(res)
                Order.PaymentSuccess()
            },
            'fail': function (res) {
                console.log(res)
                Order.PaymentFail()
            }
        })
    },
    // 支付失败
    PaymentFail: () => {
        wx.showToast({
            title: '支付失败，请重新尝试',
            success: function () {
                setTimeout(
                    function () {
                        wx.switchTab({
                            url: '../index/index',
                        })
                        // ({
                        //     url: '../detail/detail?id=' + GLOBAL_PAGE.data.artId,
                        // })
                    },
                    1500, )
            },
        })
    },
    // 支付成功
    PaymentSuccess:()=>{
        wx.showToast({
            title: '支付成功',
            success: function () {
                setTimeout(
                    function () {
                        if (GLOBAL_PAGE.data.isFromOrder)
                            wx.navigateBack()
                        else
                            wx.redirectTo({
                                url: '../detail/detail?art_id=' + GLOBAL_PAGE.data.artId,
                            })
                    },
                    1500, )
            },
        })
    },


    // // 增加会员订单
    // AddMember: ( tag_id, role_id, discount_id)=>{
    //     // var tag_id = GLOBAL_PAGE.data
    //     wx.request
    //     ({
    //         url: API.ORDER_CREATE_MEMBER,
    //         method: "GET",
    //         data: {
    //             session: wx.getStorageSync(SESSION),
    //             tag_id: tag_id,
    //             role_id: role_id,
    //             discount_id: discount_id, //优惠券id
    //         },
    //         success: function (res) {
    //             var object = res.data
    //             console.log(object)
    //             if (object.status == "true") //登陆成功
    //             {   
    //                 if (object.is_member == "false"){
    //                     Order.WxPayment(object)
    //                 }
    //                 else {
    //                     wx.showModal({
    //                         title: '重复购买',
    //                         content: '您已经是会员，请勿重复购买',
    //                     })
    //                 }
    //             }
    //             else {


    //             }
    //         },
    //         fail: function (res) {
    //         },
    //     })
    // },


    // AddSingle:()=>{
    //     wx.request
    //         ({
    //             url: API.ORDER_CREATE_SINGLE,
    //             method: "GET",
    //             data: {
    //                 session: wx.getStorageSync(SESSION),
    //                 article_id: GLOBAL_PAGE.data.artId,
    //                 discount_id: "", //优惠券id
    //             },
    //             success: function (res) {
    //                 var object = res.data
    //                 console.log(object)
    //                 if (object.status == "true") //登陆成功
    //                 {
    //                     Order.WxPayment(object)
    //                 }
    //                 else {
    //                     // wx.showModal({
    //                     //     title: '重复购买',
    //                     //     content: '您已经是会员，请勿重复购买',
    //                     // })

    //                 }
    //             },
    //             fail: function (res) {
    //             },
    //         })
    // },

}


module.exports = {
    Init:Init,
    // Discount: Discount,
    Page:Page,
    PreOrder: PreOrder,
    // Order:Order,
}