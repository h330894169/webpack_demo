define(['./app.js','./common.js'],function(module,utils){
    var modules = module.app(),common = utils.common;


    modules.filter("timeFormat", function() {
        return function(time,format) {
            if(!time)return '';
            var d = new Date(time);
            return d.format(format||"yyyy-MM-dd");
        }
    })

    modules.filter("time", function() {
        return function(time_s){
            if(!time_s)return '';
            var nowDate=new Date();

            var interval=nowDate.getTime()-time_s;

            //计算出相差天数
            var days=Math.floor(interval/(24*3600*1000));

            //计算出小时数
            var hours=Math.floor(interval/(3600*1000));

            //计算相差分钟数
            var minutes=Math.floor(interval/(60*1000));

            //计算相差秒数
            var seconds=Math.round(interval/1000);

            if(days>30){
                return "1个月前";
            }else if(days>0){
                return days+"天前";
            }else if(hours>0){
                return hours+"小时前";
            }else if(minutes>0){
                return minutes+"分钟前";
            }else if(seconds>1){
                return seconds+"秒前";
            }else{
                return "刚刚";
            }
        }
    })



    return modules;
});
