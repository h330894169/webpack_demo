require("angular")
//有依赖项的，require('app.js')一定要放前面
var module = null;
var app = function(deps){
    module = module || angular.module("webapp",angular.isArray(deps)?deps:[]);
    return module;
}
exports.app = app