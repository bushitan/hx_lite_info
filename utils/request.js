
var KEY = require('storage_key.js');
module.exports = new (function () {
    var self = this
    var loginUrl = null
    var APP_ID = null
    this.init = function (_loginUrl, _APP_ID) {

        loginUrl = _loginUrl
        APP_ID = _APP_ID
    }


    var APP
    var GlobalData
    var API_TIME = 5000               //检查进程时间间隔
    var API_LOGIN_NONE = 0       //未登录
    var API_LOGIN_ING = 1           //登陆中
    var API_LOGIN_SUCCESS = 2   //已登录
    var API_LIVE = 3  
                         //重连次数
    this.Request = function(options) {
        Init() //请求初始化
        InitRequest(options)
    }

    // 初始化
    function Init() {
        APP = getApp()
        // console.log(APP)
        GlobalData = APP.globalData
        //初始化 全局变量
        if (GlobalData.apiIsLogin == undefined) {
            GlobalData.apiIsLogin = 0 //是否经登陆
            GlobalData.apiPreList = [] //未登录前的请求队列 
            GlobalData.apiFailList = [] //请求失败的队列
            GlobalData.apiThread = false
        }

        if (GlobalData.apiThread == false) {
            setInterval(
                function () {
                    var opt = GlobalData.apiFailList.pop()
                    // console.log(opt)
                    if (opt != undefined) {
                        opt['live']--
                        _Request(opt)
                    }
                }, API_TIME)
            GlobalData.apiThread = true
        }
    }

    function InitRequest(options) {

        options['live'] = API_LIVE //请求重连生命周期
        if (GlobalData.apiIsLogin == API_LOGIN_NONE) {     //未登录
            GlobalData.apiPreList.push(options)
            _RequestLogin()
            GlobalData.apiIsLogin = API_LOGIN_ING
        }
        else if (GlobalData.apiIsLogin == API_LOGIN_ING) {  //登陆中
            GlobalData.apiPreList.push(options)
        }
        else {                                                                             //登陆成功
            _Request(options)
        }
    }

    function _RequestLogin() {
        wx.login({
            success: function (res) {
                // var _session = wx.getStorageSync(KEY.SESSION)
                _Request({
                    'live': API_LIVE,
                    'url': loginUrl,
                    'data': {
                        js_code: res.code,
                        // session: _session,
                    },
                    'success': function (res) {
                        var object = res.data
                        wx.setStorageSync(KEY.SESSION, res.data.session)
                        // wx.setStorageSync(KEY.USER_INFO, res.data.dict_user)

                        GlobalData.apiIsLogin = API_LOGIN_SUCCESS //登陆成功
                        // 执行login == false时的请求
                        for (var i in GlobalData.apiPreList) {
                            _Request(GlobalData.apiPreList[i])
                        }
                        GlobalData.apiPreList = []
                    },
                })
            },
            fail: function (res) {
                console.log("fail", res)
            },
        });
    }

    // 普通登陆
    function _Request(options) {
        // console.log(options)

        var data = options.data
        if (data == undefined)
            data = {}
        //session 不存在，设置为false
        var _session = wx.getStorageSync(KEY.SESSION)
        if (!_session) //检查session,不存在，为false
            _session = "false"
        data['session'] = _session  //每个请求都加session
        data['app_id'] = APP_ID  //每个请求都加session
        wx.request
            ({
                url: options.url,
                method: options.method || "GET",
                data: data,
                success: function (res) {
                    if (options.success != undefined)
                        options.success(res)
                },
                fail: function (res) {
                    if (options.fail != undefined)
                        options.fail(res)
                    if (options['live'] > 0)
                        GlobalData.apiFailList.push(options) //将请求加入失败队列
                },
                complete: function (res) {
                    if (options.complete != undefined)
                        options.complete(res)
                },
            })
    }

})();