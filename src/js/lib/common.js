var $ = require("jquery")
var common = window.common || {};
var LOADING = '<div class="spinner-wrap"><div class="spinner">'+
    '<div class="rect1"></div>'+
    '<div class="rect2"></div>'+
    '<div class="rect3"></div>'+
    '<div class="rect4"></div>'+
    '<div class="rect5"></div>'+
'</div></div>';
var t1 = null;
common.loading = function(isHidden){
    clearTimeout(t1);
    var $loading = $(".spinner-wrap").length > 0?   $(".spinner-wrap"):$(LOADING).appendTo("body");
    !isHidden?$loading.show():$loading.hide();
    t1=setTimeout(function(){
        $loading.hide();
    },30000)
}

//获取url参数
common.parseUrl =  function parseURL(url) {
        url = url || location.href
        var a =  document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':',''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function(){
                var ret = {},
                    seg = a.search.replace(/^\?/,'').split('&'),
                    len = seg.length, i = 0, s;
                for (;i<len;i++) {
                    if (!seg[i]) { continue; }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
            hash: a.hash.replace('#',''),
            path: a.pathname.replace(/^([^\/])/,'/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
            segments: a.pathname.replace(/^\//,'').split('/')
        };
    }
common.getParam = function(key){
    return common.parseUrl().params[key]
}

var swiperImgs = null;
common.showAllImgs = function(opts, callback) {
    require.ensure([], function(require) {
        require("swiper_css")
        require("swiper")
        var $imgSwiper = $('#imgSwiper');
        var arr = opts.imgs;
        var index = opts.start ? opts.start : 0;
        var html = '';
        if (arr.length < 1) {
            return;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            html += '<li class="swiper-slide"><img src="' + arr[i] + '" /></a></li>';
        }
        if (!$imgSwiper.length) {
            $imgSwiper = $('<div id="imgSwiper"><div class="swiper-container">'
                + '<ul class="swiper-wrapper">' + html + '</ul></div>'
                + '<div class="all-pagination pagination"></div><i class="close">X</i></div>').appendTo(document.body);
            $imgSwiper = $('#imgSwiper');
            swiperImgs = new Swiper('#imgSwiper .swiper-container', {
                longSwipesRatio: 0.2,
                initialSlide: index,
                pagination: '.all-pagination',
                paginationType: 'fraction'
            });
            $imgSwiper.find('.close').click(function (e) {
                $imgSwiper.addClass('hide');
            });
        } else {
            $imgSwiper.removeClass('hide');
            swiperImgs.removeAllSlides();
            swiperImgs.appendSlide(html);
            index = index != 0 ? index : 0;
            swiperImgs.slideTo(index, 0);
        }
        if (typeof callback == 'function') {
            callback(swiperImgs);
        }
    })
}
Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}

window.common = common;

exports.common = common;