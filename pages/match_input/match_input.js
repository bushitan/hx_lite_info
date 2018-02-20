
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GP;
Page({
    data: {

        radioItems: [
            {name: 'cell standard', value: '0'},
            {name: 'cell standard', value: '1', checked: true}
        ],
        checkboxItems: [
            {name: 'standard is dealt for u.', value: '0', checked: true},
            {name: 'standard is dealicient for u.', value: '1'}
        ],

        date: "2016-09-01",
        time: "12:01",

        countryCodes: ["+86", "+80", "+84", "+87"],
        countryCodeIndex: 0,

        countries: ["中国", "美国", "英国"],
        countryIndex: 0,

        accounts: ["微信号", "QQ", "Email"],
        accountIndex: 0,

        isAgree: false,

        matchIsBuy: true,
        matchTitle: "",
        matchConetent: "级别：\n价格：\n数量：\n交货地：\n",
        matchPhone: "",
        // match: "",
    },
    switchIsBuy(e){
        // console.log(e.detail.value)
        GP.setData({ matchIsBuy: e.detail.value})
    },
    inputTitle(e) {
        // console.log(e.detail.value)
        GP.setData({ matchTitle: e.detail.value })
    },
    inputContent(e) {
        // console.log(e.detail.value)
        GP.setData({ matchConetent: e.detail.value })
    },
    inputPhone(e) {
        // console.log(e.detail.value)
        GP.setData({ matchPhone: e.detail.value })
    },

    // 1 是买 
    // 0 是卖
    setNews: function(){
        var _is_buy = 1
        if (GP.data.matchIsBuy == false)
            _is_buy = 0
        wx.request
        ({
            url: API.MATCH_SET_ISSUE,
            method: "GET",
            data: {
                session: wx.getStorageSync(KEY.session),
                // tag_id: wx.getStorageSync(APP.KEY.FATHER_TAG).tag_id,  //加到父标签中
                tag_id: GP.data.sonTag.tag_id,  //加到子标签              
                is_buy: _is_buy,
                title: GP.data.matchTitle,
                content: GP.data.matchConetent,
                phone: GP.data.matchPhone,
            },
            success: function (res) {
                APP.globalData.isRefreshMatch = true     //成功后，刷新页面
                //点击返回按钮，退会供求页面
                wx.showModal({
                    title: '发布信息成功',
                    showCancel: false,
                    confirmText:"返回查看",
                    success: function (res){
                        wx.navigateBack({})
                    },
                })
            },
            fail: function (res) {
            },
        })
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems
        });
    },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if(checkboxItems[i].value == values[j]){
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    bindCountryCodeChange: function(e){
        console.log('picker country code 发生选择改变，携带值为', e.detail.value);

        this.setData({
            countryCodeIndex: e.detail.value
        })
    },
    bindCountryChange: function(e) {
        console.log('picker country 发生选择改变，携带值为', e.detail.value);

        this.setData({
            countryIndex: e.detail.value
        })
    },
    bindAccountChange: function(e) {
        console.log('picker account 发生选择改变，携带值为', e.detail.value);

        this.setData({
            accountIndex: e.detail.value
        })
    },
    bindAgreeChange: function (e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },


    onLoad(){
        GP = this;

        GP.setData({
            fatherTag: wx.getStorageSync(APP.KEY.FATHER_TAG),
            sonTag:wx.getStorageSync(APP.KEY.MATCH_SON_TAG)
        })
        
    },
    onShow(){
        wx.setNavigationBarTitle({  // 设置当前页面
            title: " 供求信息发布"
        })
       
    },


    openDialog() {
        GP.setData({
            showDialog: true
        })
    },    /**
     * 事件
     * 关闭 子类标签 Dialog 
     */
    closeDialog() {
        GP.setData({
            showDialog: false
        })
    },


    // 点击标签
    clickSonTag(e) {
        // var tag_id = e.currentTarget.dataset.tag_id
        var _son_tag_id = e.currentTarget.dataset.tag_id
        var father_tag = GP.data.fatherTag
        for (var i = 0; i < father_tag.match_list.length; i++) {
            if (father_tag.match_list[i].tag_id == _son_tag_id) {
                GP.setData({
                    sonTag: father_tag.match_list[i]
                })
                // wx.setStorageSync(APP.KEY.MATCH_SON_TAG, father_tag.match_list[i]) //为input的目录做准备
                break
            }
        }

        

        GP.closeDialog() 
        // PRO_ARTICLE.ClearArticle(GP)
        // PRO_ARTICLE.RequestByRosterMatch(API, GP, API.ROSTER_GET_LIST_MATCH, GP.data.isBuy, e.currentTarget.dataset.tag_id)
        // GP.closeDialog() //关闭dialog
    },

});