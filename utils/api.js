
var API_REQUEST = require('request.js');
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



var host_url = 'http://127.0.0.1:8000/huaxun_2/api/';
// var host_url = 'https://xcx.308308.com/huaxun_2/api/';
var api_308_url = 'http://127.0.0.1:8000/huaxun_2/api308/';
// var api_308_url = ' https://api.308308.com/';

var APP_ID = "wx51930c31391cc5cc"
API_REQUEST.init(host_url + 'my/login/', APP_ID)

module.exports = {
    Request: API_REQUEST.Request,
    TOKEN_CREATE: host_url + 'token/create/',

    API_308_GET_ALL_INDUSTRY: api_308_url + 'cms/get/industry/',




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


