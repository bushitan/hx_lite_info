'use strict';

/* api.js  公共类
    小程序的api接口集合 
 */ 
// 1488713872
// gxhxweihuaxuntong077155533360000
// var host_url = 'http://127.0.0.1:8001/'; 
// var host_url = 'http://127.0.0.1:8000/'; 
// var host_url = 'http://127.0.0.1:8000/huaxun/'; 
// var host_url = 'http://192.168.200.109:8000/huaxun/'; 
// var host_url = 'http://192.168.199.203:8000/huaxun_2/api/';
// var host_url = 'http://127.0.0.1:8000/huaxun/api/';
// var host_url = 'http://192.168.200.104:8000/huaxun/api/'; 

// var host_url = 'http://192.168.199.203:8001/huaxun/'; 
// var host_url = 'http://192.168.199.203:8002/huaxun/'; 
// var host_url = 'http://192.168.200.23:8000/huaxun/'; 
// var host_url = 'http://192.168.200.27:8000/'; 
// var host_url = 'https://www.12xiong.top/wx_app/';
// var host_url = 'https://xcx.308308.com/huaxun/';
// var host_url = 'http://xcx.308308.com/huaxun/';
// var host_url = 'http://www.12xiong.top/';



// var host_url = 'http://127.0.0.1:8000/huaxun_2/api/';
var host_url = 'https://xcx.308308.com/huaxun_2/api/';

function Request(options) {
    // url, data, success, fail, complete
    var data = options.data
    if (data == undefined)
        data = {}
    data['session'] = wx.getStorageSync("session")  //每个请求都加session
    wx.showLoading({
        title: 'Loading',
    })
    wx.request
        ({
            url: options.url,
            method: "GET",
            data: data,
            success: function (res) {
                if (options.success != undefined)
                    options.success(res)
            },
            fail: function (res) {
                if (options.fail != undefined)
                    options.fail(res)
            },
            complete: function (res) {
                if (options.complete != undefined)
                    options.complete(res)
                wx.hideLoading()
            },
        })
}

module.exports = {
    Request: Request,

    // GetArticleSearch: host_url + 'api/',
    // 快讯
    ARTICLE_INDEX: host_url + 'article/index/',
    ARTICLE_GET_LIST_TAG: host_url + 'article/get_list/tag/',
    ARTICLE_GET_ID: host_url + 'article/get/id/',
    ARTICLE_GET_LIST_SEARCH: host_url + 'article/get_list/search/',
    ARTICLE_CHECK_SINGLE: host_url + 'article/check/single/',
    //活动
    ARTICLE_GET_LIST_MEET: host_url + 'article/get_list/meet/',

    // 供求
    MATCH_SET_ISSUE: host_url + 'match/set/issue/',
    MATCH_GET_LIST_TAG: host_url + 'match/get_list/tag/',
    MATCH_GET_LIST_SELF: host_url + 'match/get_list/self/',
    MATCH_DELETE_SELF: host_url + 'match/delete/self/',

    // 我 登陆
    MY_LOGIN: host_url + 'my/login/',
    MY_SET_WX: host_url + 'my/set/wx/',
    MY_SET_ROSTER: host_url + 'my/set/roster/',
    MY_GET_SELF: host_url + 'my/get/self/',

    // 支付
    PAY_GET_TAG: host_url + 'pay/get/tag/',
    PAY_CREATE_ORDER: host_url + 'pay/create/order/',
    PAY_CONFIRM_ORDER: host_url + 'pay/confirm/order/',
    PAY_GET_LIST_MEMBER: host_url + 'pay/get_list/member/',
    PAY_GET_LIST_DISCOUNT: host_url + 'pay/get_list/discount/',

    // 2018-2-4 增
    PAY_GET_PROTOCOL: host_url + 'pay/get/protocol/',
    PAY_CONFIREM_RENEW: host_url + 'pay/confirm/renew/',
    // PAY_CALLBACK_RENEW: host_url + 'pay/callback/wx_renew/',
    // PAY_CALLBACK_WX: host_url + 'pay/callback/wx/',

    // 花名册
    ROSTER_GET_TAG: host_url + 'roster/get_list/tag/',
    ROSTER_GET_ID: host_url + 'roster/get/id/',
    ROSTER_GET_LIST_SEARCH: host_url + 'roster/get_list/search/',
    ROSTER_GET_LIST_MATCH: host_url + 'roster/get_list/match/',
    ROSTER_GET_SELF: host_url + 'roster/get/self/',
    ROSTER_SET_SELF: host_url + 'roster/set/self/',
    ROSTER_GET_LIST_AREA: host_url + 'roster/get_list/area/',
    ROSTER_GET_AREA_LIST: host_url + 'roster/get_area_list/',
    
}

// // 获取标签
// function _index() {
//     return host_url + 'api/index/';
// }	

// // 获取标签
// function _getTag(){
// 	return host_url+'api/tag/';
// }	

// //根据标签获取文章列表
// function _getArticleByTag(){
//     return host_url + 'api/tag/article/';
// }	

// //获取文章内容
// function _getArticleContent(){
//     return host_url +'api/article/';
// }	



// //用户登录
// function _userLogin(){
//     return host_url +'api/user/login/';
// }	


// //获取用户历史记录
// function _getUserTrace(){
//     return host_url +'api/user/trace/';
// }
// //获取用户信息
// function _getUserInfo() {
//     return host_url + 'api/user/info/';
// }
// //设置用户头像，名字信息
// function _setUserInfo() {
//     return host_url + 'api/user/set/login_info/';
// }
// //设置用户头像，名字信息
// function _setPhoneInfo() {
//     return host_url + 'api/user/set/phone_info/';
// }

// //支付解锁
// function _checkPay(){
//     return host_url +'api/check/pay/';
// }

// //电话解锁
// function _checkPhone(){
//     return host_url +'api/check/phone/';
// }











    // //首页初始化
    // Index: _index,
	
	// //标签查询
	// GetTag:_getTag,
	// GetArticleByTag:_getArticleByTag,
    // GetArticleContent: _getArticleContent,
    // GetArticleSearch: host_url + 'api/article/search/', //文章标题搜索记录

    // GetArticleReadTraceSearch: host_url + 'api/article/read_trace/', //文章标题搜索记录

    
	// //解锁路径
	// // CheckPay:_checkPay,
    // // CheckPhone: _checkPhone,
    
    // ORDER_PAYMENT_PAGE: host_url + 'api/order/create_payment_page/',
    // ORDER_CREATE_MEMBER: host_url + 'api/order/create_member/',
    // ORDER_CREATE_SINGLE: host_url + 'api/order/create_single/',
    // ORDER_ADD: host_url + 'api/order/add/',
    // ORDER_PAY_SUCCESS: host_url + 'api/order/pay_success/',

    // ORDER_GET_ORDER: host_url + 'api/order/get_order/',
    // ORDER_GET_MEMBER: host_url + 'api/order/get_member/',


    // ORDER_COMFIRM_MEMBER: host_url + 'api/order/confirm_member/', //确定会员订单
    // ORDER_PRE_MEMBER: host_url + 'api/order/pre_member/', //获取预备会员订单
    // ORDER_PRE_SINGLE: host_url + 'api/order/pre_single/', //获取预备点播订单
    // ORDER_GET_DISCOUNT: host_url + 'api/order/get_discount/',

    // //供求信息
    // MATCH_INDEX: host_url + 'match/index/',
    // MATCH_SET_DETAIL_BY_USER: host_url + 'match/set/detail_by_user/',
    // MATCH_GET_DETAIL_BY_ID: host_url + 'match/get/detail_by_id/',
    // MATCH_GET_LIST_BY_USER: host_url + 'match/get/list_by_user/',
    // MATCH_DETELE_BY_ID_USER: host_url + 'match/delete/by_id_user/',

	// //活动、会议模块接口
    // MEET_INDEX : host_url + 'api/meet/index/',


    // //供求信息
    // ROSTER_INDEX: host_url + 'roster/index/',


	// //用户接口
	// UserLogin:_userLogin,
	// GetUserTrace:_getUserTrace,  
    // GetUserInfo:_getUserInfo,
    // SetUserInfo: _setUserInfo,
    // SetPhoneInfo: _setPhoneInfo,


