define(['./app.js','./common.js'],function(module,utils){
    var modules = module.app(),common = utils.common;
    var config = ["$httpProvider", function ($httpProvider) {
        $httpProvider.defaults.cache = false;
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', '$log','$location', function ($q, $cacheFactory, $timeout, $rootScope, $log,$location) {
            return {
                'request': function(config) {
                    return config;
                },

                'response': function(response) {
                    $httpProvider.defaults.headers.common.token = "123"
                    var ret = response.data;
                    //angular请求的html页面
                    if (typeof ret == "string")
                        return response;
                    //后台返回的json
                    //1登录成功，返回信息--101没有登录，需要登录
                    if (ret.code == 'login') {
                        //$location.path('/login');
                        return $q.reject(response);
                    } else if (ret.code != '0000') {
                        common.tips(ret.message || '系统异常，请联系管理员喔');
                        common.loading(true);
                        return $q.reject(response);
                    } else {
                        return response;
                    }
                },
                'responseError': function(rejection) {
                    common.tips('网络有问题，请稍后再试.');
                    common.loading(true);
                    //alert("网络有问题，请稍后再试.");
                    return $q.reject(rejection);
                }
            };
        }];

        $httpProvider.interceptors.push(interceptor);
    }];


    modules.config(config);
    modules.service('indexService',['$http','$q',function($http,$q){
    }]);
    modules.service('scrollLoadService',['$http','$httpParamSerializerJQLike',function($http,$httpParamSerializerJQLike){
        var scrollLoad = function(options){
            //结果集
            this.list = [];
            //是否繁忙
            this.busy = false;
            //组件翻页控制器
            this.end_time = null;
            //服务
            this.service = options.service||null;
            //服务方法名字
            this.functionName = options.functionName||null;
            //发送请求的参数名
            this.keyName = options.keyName||"end_time";
            this.pageKey = options.pageKey||"create_time";
            //附加参数
            this.param = options.param || {limit:10};
            options && angular.extend(this,options);
        }
        scrollLoad.prototype.reset = function(){
            this.list = [];
            this.busy = false;
            this.end_time = null;
        }
        scrollLoad.prototype.destroy = function(){
            this.list = [];
            this.busy = true;
            this.end_time = null;
        }
        scrollLoad.prototype.nextPage = function() {
            debugger
            if (this.busy || !this.service || !this.functionName) return;
            this.busy = true;
            var that = this;
            common.loading();
            var tempObj = {}
            tempObj[this.keyName] = that.end_time;
            this.service[this.functionName].apply(this.service,[angular.extend(this.param,tempObj)]).success(function(data){
                if(!data){
                    return
                }
                common.loading(true);
                if(data.result.length == 0){
                    that.busy = true;
                    if(!that.end_time){
                        common.tips("没有相关数据");
                    }
                    return;
                }
                that.list = that.list.concat(data.result);
                that.end_time = data.result[data.result.length-1][that.pageKey];
                that.busy = false;
            }).error(function(){
                that.busy = false;
                common.loading(true);
            })
        };
        this.getScrollLoad = function(options){
            return new scrollLoad(options);
        };
    }]);


    return modules;
});
