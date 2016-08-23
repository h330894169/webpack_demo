define(['./app.js'],function(module) {
    var directives = module.app()
    directives.directive('finishRepeat', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('finishRepeated');
                        if (scope.$parent) {
                            var fun = scope.$parent[attr.finishRepeat];
                            if (fun) {
                                fun();
                            }
                        }
                    });
                }
            }
        };
    }]);

    /***
     * 图片浏览  图片需要带 preview 样式
     */
    directives.directive('imgView', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.$on('$destroy', function() {
                    $(element).off();
                });
                $timeout(function () {
                    $(element).on('click','.preview', function (e) {
                        e.preventDefault();
                        var arr = [];
                        var index = $(this).index();
                        var $imgs = $(this).closest('.imgs').find('.preview');
                        for (var i = 0, len = $imgs.length; i < len; i++) {
                            arr.push($imgs.eq(i).attr('data-large'));
                        }
                        common.showAllImgs({ 'imgs': arr, 'start': index }, function (swiper) {
                        });
                    });
                });
            }
        };
    }]);

    var lazy = function(isRepeat,$timeout){
        return function (scope, element, attr) {
            if (isRepeat && scope.$last != true) {
                return;
            }
            $timeout(function(){
                require.ensure([], function(require) {
                    require("jquery_lazyload/jquery.lazyload.js")
                    $(element).parent().find(".lazy").lazyload({
                        effect: "fadeIn",
                        threshold: 100
                    })
                })
                if (scope.$parent) {
                    var fun = scope.$parent[attr.lazyLoad]||scope.$parent[attr.lazyLoadRepeat];
                    if (fun) {
                        fun();
                    }
                }
            })

        }
    }
    /***
     * 图片懒加载
     */
    directives.directive('lazyLoad', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: lazy(false,$timeout)
        };
    }]);

    /**
     * 循环图片懒加载
     * */
    directives.directive('lazyLoadRepeat', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: lazy(true,$timeout)
        };
    }]);

    directives.directive('fileUpload', ['$rootScope', '$http', function ($rootScope, $http) {
        return function (scope, ele, attr) {
            ele.bind('change', function (e) {
                //上传
                var fn = attr.fileUpload;//回调方法，本例为$scope中的upload()方法
                var file = e.target.files[0];
                var url = $(ele).data("url");
                if (file == undefined || !url) {//没选择文件
                    return false;
                }
                var form = new FormData();
                form.append("name", "name");
                form.append("file_name", "file_name");
                form.append("data", file);
                form.append("mini_type", file.type);
                $http.post(url, form, {
                    headers: {
                        'Content-Type': undefined//如果不设置Content-Type,默认为application/json,七牛会报错
                        // 'Content-Type': 'application/json'
                    }
                }).success(function (data) {
                    scope[fn](data,ele);//上传回调，将url传到upload方法中
                });
            });
        };
    }]);
})