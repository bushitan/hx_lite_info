



/**
 * 检测默认 父类标签
 */
function CheckDefaultFatherTag(matrix,options_tag_id,storage_tag){
    var _temp_id 
    if (options_tag_id != undefined) 
        _temp_id = options_tag_id //传入的id存在
    else  
        _temp_id = storage_tag.tag_id  //检测本地的存储

    for (var i = 0; i < matrix.length; i++)        
        if (parseInt(matrix[i].tag_id) == parseInt(_temp_id)) {
            return matrix[i]  // 符合结果，提取父类的tag
        }
    return matrix[0] // 结果都不符合，返回第一个父类标签     
}

/**
 * 检测滑动锁
 */
function CheckScrollLock(GP) {
    if (GP.data.isMore == false) //没有更多文章，返回
        return false
    if (GP.data.isScrollLock == true) //下拉查询锁已关闭，返回
        return false
    GP.setData({
        isScrollLock: true  //关闭查询锁
    })
    return true
}

/**
 * 将广告加入文章
 */
var b_index = 0
function SetBannerInArticle(banner_list ,article_list){
    if (banner_list == undefined)
        return article_list
    if (banner_list.length > 0 && article_list.length > 4) {
        var _index_banner = b_index % banner_list.length
        // banner_list[_index_banner]["is_banner"] = 1
        article_list.splice(4,0, banner_list[_index_banner])
        b_index++
    }
    return article_list
}

/**
 * 清空文章内容
 */
function ClearArticle(GP){
    GP.setData({
        articleList: [],
        startIndex: 0,
        isMore: true,
        isScrollLock: false, //查询锁，防止结果未返回，又继续查
    })
}


/** 
 *  1 初始化文章列表--请求成功
 */
function RequestIndexByAd(API,GP, son_tag_id){
    API.Request({
        'url': API.ARTICLE_INDEX,
        'data': {
            tag_id: son_tag_id,
            start_index: 0,
            end_index: GP.data.rangeIndex,
        },
        'success':function(res) {
            var object = res.data
            var article_list = SetBannerInArticle(object.banner_list, object.article_list)
            GP.setData({
                articleList: article_list, //初始化文章，
                bannerList: object.banner_list, //与文章混合的广告条
                swiperList: object.swiper_list, //滚动栏目
                startIndex: GP.data.startIndex + GP.data.rangeIndex,
            })
        },
    })
}



/** 
 *  2 index请求文章列表--请求成功
 */
function RequestByAd(API, GP, son_tag_id) {
    API.Request({
        'url': API.ARTICLE_GET_LIST_TAG,
        'data': {
            tag_id: son_tag_id,
            start_index: GP.data.startIndex,
            end_index: GP.data.startIndex + GP.data.rangeIndex,
        },
        'success': function (res) {
            var object = res.data
            _CheckIsMore(GP, object.article_list.length, GP.data.rangeIndex)//没有文章了，下拉刷新结束
            var article_list = SetBannerInArticle(GP.data.bannerList, object.article_list)
            // article_list = article_list.concat(GP.data.articleList) //新增文章拼接
            var new_article_list = GP.data.articleList.concat(article_list) //新增文章拼接
            GP.setData({
                articleList: new_article_list, //初始化文章，
                startIndex: GP.data.startIndex + GP.data.rangeIndex, //更新范围
                isScrollLock: false  //解锁
            })
        },
    })
}


/** 
 * 3.1  请求文章列表-- 根据tag
 */
function RequestByTag(API, GP, url, tag_id ) {
    API.Request({
        'url': url,
        'data': {
            tag_id: tag_id,
            start_index: GP.data.startIndex,
            end_index: GP.data.startIndex + GP.data.rangeIndex,
        },
        'success': function(res){
            _BaseSuccess(res,GP)
        },
    })
}


/** 
 * 3.2  请求文章列表-- 供求信息筛选
 */
function RequestByMatchChoice(API, GP, url, tag_id, action) {
    API.Request({
        'url': url,
        'data': {
            tag_id: tag_id,
            start_index: GP.data.startIndex,
            end_index: GP.data.startIndex + GP.data.rangeIndex,
            action: action,
        },
        'success': function (res) {
            _BaseSuccess(res, GP)
        },
    })
}


/** 
 * 3.1  请求文章列表-- isBy
 */
function RequestByTag(API, GP, url, tag_id) {
    API.Request({
        'url': url,
        'data': {
            tag_id: tag_id,
            start_index: GP.data.startIndex,
            end_index: GP.data.startIndex + GP.data.rangeIndex,
        },
        'success': function (res) {
            _BaseSuccess(res, GP)
        },
    })
}

/** 
 * 3.2  请求文章列表-- 根据关键字
 */
function RequestByKeyWord(API, GP, url ,keyword_title ) {
    API.Request({
        'url': url,
        'data': {
            keyword_title: GP.data.keyword_title,
            start_index: GP.data.startIndex,
            end_index: GP.data.startIndex + GP.data.rangeIndex,
        },
        'success': function (res) {
            _BaseSuccess(res, GP)
        },
    })
}

/** 
 * 3.2  请求文章列表-- 搜索文章 
 */
function RequestBySearch(API, GP, url, keyword_title) {
    API.Request({
        'url': url,
        'data': {
            keyword_title: GP.data.keyword_title,
            start_index: GP.data.startIndex,
            end_index: GP.data.startIndex + GP.data.rangeIndex,
            start_time: GP.data.dateStart,
            end_time: GP.data.dateEnd,
        },
        'success': function (res) {
            _BaseSuccess(res, GP)
        },
    })
}

/** 
 * 5  - 搜索花名册
 */
function RequestByRosterSearch(API, GP, url, keyword_title,father_tag_id) {
    API.Request({
        'url': url,
        'data': {
            keyword_title: GP.data.keyword_title,
            start_index: GP.data.startIndex,
            end_index: GP.data.startIndex + GP.data.rangeIndex,
            start_time: GP.data.dateStart,
            end_time: GP.data.dateEnd,
            tag_id: father_tag_id,
        },
        'success': function (res) {
            _BaseSuccess(res, GP)
        },
    })
}

/** 
 * 6  - 按供应/求购 关系 查询商圈
 */
function RequestByRosterMatch(API, GP, url, is_buy, tag_id) {
    API.Request({
        'url': url,
        'data': {
            is_buy: is_buy,
            tag_id: tag_id,
            start_index: GP.data.startIndex,
            end_index: GP.data.startIndex + GP.data.rangeIndex,
        },
        'success': function (res) {
            _BaseSuccess(res, GP)
        },
    })
}

/** 
 * 7  - 按区域 关系 查询商圈
 */
function RequestByRosterArea(API, GP, url, area_id, tag_id) {
  API.Request({
    'url': url,
    'data': {
      area_id: area_id,
      tag_id: tag_id,
      start_index: GP.data.startIndex,
      end_index: GP.data.startIndex + GP.data.rangeIndex,
    },
    'success': function (res) {
      _BaseSuccess(res, GP)
    },
  })
}





/**
 *  3 基础的成功返回事件，更新列表
 */
function _BaseSuccess(res, GP) {
    var object = res.data
    _CheckIsMore(GP,object.article_list.length, GP.data.rangeIndex)//没有文章了，下拉刷新结束
    var article_list = GP.data.articleList
    article_list = article_list.concat(object.article_list) //新增文章拼接
    GP.setData({
        articleList: article_list, //初始化文章，
        startIndex: GP.data.startIndex + GP.data.rangeIndex, //更新范围
        isScrollLock: false  //解锁
    })
}

/**
 * 检测是否还有文章
 */
function _CheckIsMore(GP,article_length ,  limit_length ){
    if (article_length < limit_length) { //没有文章了，下拉刷新结束
        GP.setData({
            isMore: false,
        })
    }
}



module.exports = {
    CheckDefaultFatherTag: CheckDefaultFatherTag, //检测默认显示的行业标签
    SetBannerInArticle: SetBannerInArticle, //将banner与文章混合
    ClearArticle: ClearArticle, //清空文章内容
    CheckScrollLock: CheckScrollLock, //滑动底部锁检测
    RequestIndexByAd: RequestIndexByAd ,// 初始化 请求文章列表
    RequestByAd: RequestByAd, //请求文章列表
    RequestByTag: RequestByTag, //请求文章 --tag
    RequestByMatchChoice: RequestByMatchChoice,
    RequestByKeyWord: RequestByKeyWord, //请求文章 -- 关键字
    RequestBySearch: RequestBySearch,//搜索文章
    RequestByRosterSearch: RequestByRosterSearch, //花名册搜索
    RequestByRosterMatch: RequestByRosterMatch, //花名册 供应/求购  标签查询
    RequestByRosterArea: RequestByRosterArea, // 按区域  标签 查询
}