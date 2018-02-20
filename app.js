//app.js
var API = require('utils/api.js');
var Key = require('utils/storage_key.js');
var g
var GP
App({
    
    //全局变量配置
    STATIC: {
        YES: 1,
        NO:  0,
        ROLE_LEVEL_1 : 1,
        ROLE_LEVEL_2 : 2,
        ROLE_LEVEL_3 : 3,
    },
    KEY: {
        //快讯 
        FATHER_TAG:"father_tag",
        // INDEX_FATHER_TAG_ID: "index_father_tag_id", //重新设置的father标签id
        // INDEX_FATHER_TAG: "index_father_tag", //重新设置的father标签id
        // INDEX_IS_RESET_TAG: "index_is_reset_tag", //是否重新设置father标签
        INDEX_ARTICLE_LIST:"index_article_list", //index的当前显示标签，文章内点击下一篇使用

        MATCH_SON_TAG:"match_son_tag",
        //供求
        // MATCH_IS_RESET_TAG: "match_is_reset_tag", //是否重新设置father标签
        // MATCH_FATHER_TAG_ID: "match_father_tag_id",

    },

    //支付页面的四种情况
    PAY_METHOD: {
        METHOD_NORMAL_2_VIP: '1001',
        METHOD_NORMAL_2_SUPER_VIP: '1002',
        METHOD_VIP_2_SUPER_VIP: '1003',
        METHOD_OFF_LINE : '1004',
        METHOD_VIP_OR_SUPER_VIP: '1005',
    },
    globalData:{
        pagePrivate:null,
        pagePublic:null,
        windowWidth:null,
        windowHeight:null,
        isLogin:false,
        tagMatrix:[],
        tagFatherList:[],
        title:'',
        userMemberList:[], //用户会员列表 
        user_id:"", //用户id
        isRefreshMatch:false,//match 页面是否刷新
    }, 

    /**
     *  检测用户是否当前行业的会员
     */
    checkMember(article_role_value){
        var _memberList = GP.globalData.userMemberList
        var _father_tag = wx.getStorageSync(GP.KEY.FATHER_TAG )
        for ( var i=0 ; i<_memberList.length;i++){
            if (_memberList[i].tag_id == _father_tag.tag_id)  //如果行业相同
                if (_memberList[i].role_value > GP.STATIC.ROLE_LEVEL_1 && article_role_value == undefined)    //如果为会员
                    return true
                else if (_memberList[i].role_value >= article_role_value)
                    return true
        }
        return false
    },

    // 检查续费
    chechRemain(){
        var _member_list = GP.globalData.userMemberList
        var _father_tag = wx.getStorageSync(GP.KEY.FATHER_TAG)
        var _content = ""
        for (var i = 0; i < _member_list.length; i++) {
            if (_member_list[i].tag_id == _father_tag.tag_id)
                if (_member_list[i].remain_time < 30) //剩余天数
                    _content += _member_list[i].tag_name + '会员还有' + _member_list[i].remain_time + "天到期。"
        }

        if (_content != ''){
            _content = _content + '请即时续费'
            wx.showModal({
                title: '温馨提示',
                content: _content,
                confirmText: "续费",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../pay_renew/pay_renew',
                        })
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        }
            
    },


  onLaunch: function () {
        var that =this
        GP = this
        var _pixelRatio,_windowWidth,_windowHeight
        
        wx.getSystemInfo({
          success: function(res) {
            //设置屏幕宽/高
            // console.log(res)
            that.globalData.windowWidth = res.windowWidth
            that.globalData.windowHeight = res.windowHeight
            console.log(res.windowWidth,res.windowHeight,res.pixelRatio)
          }
        })

        // that.login()
    },

    login:function(option){
        console.log("session:", wx.getStorageSync('session') )
        wx.login
        ({
            success: function (res) 
            {               

                var _session = wx.getStorageSync('session') 
                if (! _session  ) //检查session,不存在，为false
                    _session = "false"
                var url = API.MY_LOGIN
                console.log(res.code)
                wx.request
                ({  
                        url: url, 
                        method:"GET",
                        data:{
                                js_code:res.code,
                                session:_session,
                        },
                        success: function(res)
                        {
                                var object = res.data
                                console.log("success:")
                                console.log(res)
                                GP.globalData.tagMatrix = object.tag_matrix
                                GP.globalData.tagFatherList = object.tag_father_list

                                GP.globalData.user_id = object.user_id
                                GP.globalData.logo = object.logo
                                GP.globalData.nick_name = object.nick_name

                                GP.globalData.userMemberList= object.user_member_list
                                GP.chechRemain() //检查会员到期

                                console.log(object.tag_matrix)
                                //初始化静态变量
                                // GP.STATIC = res.data.util

                                wx.setStorageSync('session', res.data.session)
                                //Todo 初始化页面、目录
                                // GP.onInit()
                                getCurrentPages()[0].onInit(option)

                                GP.globalData.isLogin = true
                                //暂时专供抢画后保存图片用，日后与login合体          
                        },
                        fail:function(res) { 
                            wx.showModal({
                            title: '网络连接失败，是否重新登陆？',
                            content:'请确认网络是否正常',
                            confirmText:"重新登陆",
                            success: function(res) {
                                if (res.confirm) {
                                    GP.login()
                                }
                                
                            }
                            }) 
                        },
                })
            }
        });
    },



})



    

"pages/relate/relate",
"pages/ware_in/ware_in",
    "pages/ware_out_card/ware_out_card",
    "pages/cart/cart",
    "pages/private/private",
    "pages/public/public",
    "pages/together/together",
    "pages/painter/painter",
    "pages/watermark/watermark",
    "pages/gallery/gallery",
    "pages/category/category",
    "pages/player/player",
    "pages/manage/manage"