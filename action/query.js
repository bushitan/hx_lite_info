
// var RANDOM = require('utils/api.js')
// var MD5 = require('md5.js')
// var appKey = "12101be04a3f9c65a1cd24b3"
// var Key = "f803e0a4a08c48a31456b4ed"

module.exports = new (function () {
    var self = this
    var APP = null
    var GP = null
    this.init = function (_app, _GP) {
        APP = _app
        GP = _GP
    }

    this.getGP = function(){
        return GP
    }

})();
