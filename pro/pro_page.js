/**
 * 页面初始化
 */
var APP = getApp()
function Init(GP, title='' ){

    //初始化文章显示参数
    GP.setData({
        articleList: [],    //文章列表
        startIndex: 0,   //文章初始查询位置
        rangeIndex: 10,  //查询范围
        isMore: true,    //是否还有更多文章
        isScrollLock: false, //查询锁，防止结果未返回，又继续查
    })
    wx.setNavigationBarTitle({  // 设置当前页面
        title: APP.globalData.title + title
    })
}

module.exports = {
    Init:Init,
}