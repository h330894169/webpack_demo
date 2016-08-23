require("../css/common.css");
require("../css/index.css");
var $ = require("jquery");
require("angular");
var app = require('./lib/app.js').app(['infinite-scroll']);
var common = require("./lib/common.js").common
require("./lib/services.js")
require("./lib/filters.js")
require("./lib/directives.js")
require("ngInfiniteScroll/build/ng-infinite-scroll.js")
app.controller('indexCtrl', ['$scope',function($scope) {
    $scope.title = "title by ng";
}])
angular.element(document).ready(function(){
    angular.bootstrap(document.body,['webapp']);
})


