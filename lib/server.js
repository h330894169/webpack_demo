/**
 *server 服务
 * @author lihua 
 *
 */
module.exports = plugin;
var browserSync = require('browser-sync').create();
var httpProxy = require('http-proxy');  
var proxy = httpProxy.createProxyServer({}); 
var node_path = require('path');
var url = require('url');
function plugin(options) {
	
var isReady = false;
var startPath = "/index.html";
var proxyUrl = options.dataSource?"http://www.xxx.com/":"http://www.xxx.com/xx/";
var cookie = {};
var timer = null;
// 捕获异常  
proxy.on('error', function (err, req, res) {  
  res.writeHead(500, {  
    'Content-Type': 'text/plain'  
  });  
  res.end('Something went wrong. And we are reporting a custom error message.');  
}); 

proxy.on('proxyReq', function(proxyReq, req, res, options) {
	//console.log(res.getHeader["set-cookie"]);  
	if(cookie){
	  //proxyReq.setHeader('cookie', cookie[res.getHeader["set-cookie"]]);
	  proxyReq.setHeader('cookie', cookie);
	}
});

proxy.on('proxyRes', function(proxyRes, req, res, options) {
	var proxyCookie = proxyRes.headers["set-cookie"];
	if(proxyCookie){
		
		//cookie[req.headers["cookie"]] = proxyCookie;
		cookie  = proxyCookie;
		//console.log(req)
	}
	//res.setHeader("Set-Cookie", [proxyRes.headers["set-cookie"]]);
});

var path = {
	dev:["distxxxx/**"],
	svn:[".svn/**","../static/.svn"]
}
console.log("server watch path is:" + path.dev)


browserSync.init({
     server: {
        readDelay:100,
        baseDir: ["./dist"/**,'bower_components'**/],
        routes: {
            //"/bower_components": "bower_components",
	        "/": ""

	    },
	    middleware: function (req, res, next) {
            //next();
	        if(url.parse(req.url).pathname.indexOf(".")==-1){
	        	 proxy.web(req, res, { target: proxyUrl });  
	        }else{
		        next();
	        }
	    }
    },
    open: "external",
    files:path.dev,
    browser:"chrome",
    startPath: startPath
});
browserSync.watch(path.dev).on("ready",function(){
	isReady = true;
	console.log("server is ready........")
})
browserSync.watch(path.dev).on("change",function(path){
	if(isReady){
		if(options.watchCallBack){
			options.watchCallBack(path);
		}
	}
})
browserSync.watch(path.dev).on("add",function(path){
	if(isReady){
		if(options.watchCallBack){
			options.watchCallBack(path);
		}
        clearTimeout(timer);
        timer = setTimeout(function(){
            console.log("reload.....")
            browserSync.reload();
        },100)
	}
})
var svnChange = function(file_path){
}
browserSync.watch(path.svn).on("change",svnChange)
browserSync.watch(path.svn).on("add",svnChange)
return browserSync;
}