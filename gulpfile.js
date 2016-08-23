/**
 * Created by test on 2016/6/1.
 */
var gulp = require("gulp");
var webpack = require("webpack");
var gutil = require("gulp-util");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var server = require("./lib/server.js");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var srcDir = "./src";
var argv = require('yargs').argv;//获取命令行参数
var is_dev = argv.d || !argv.p;
var bowerRoot = __dirname+"/bower_components"

function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    /**
    files['vendors'] = ['jquery','angular'];
    files['jquery'] = ['jquery'];
    files['angular'] = ['angular'];
     **/
    return files;
}
function getHashName() {
    return !is_dev?'.[hash:8]':'';
}

var htmlGenerator = function () {
    var r = [];
    var entryHtml = glob.sync(srcDir + '/*.html');

    entryHtml.forEach(function (filePath) {
        //var matchs = filePath.match(/(.+)\.html$/);//filePath.substring(filePath.lastIndexOf('src/') + 4, filePath.lastIndexOf('.'));
        var filenameArray =path.basename(filePath,".html").split(".");
        var htmlName = filenameArray[0];
        //这里是构建common
        /**
        r.push(new CommonsChunkPlugin({
            name: "common_"+htmlName,
            //minChunks:3,
            //minSize: 2,
            chunks:[htmlName,'vendors'].concat(filenameArray.slice(1)),
            filename: "js/[name]"+getHashName()+".js"
        }))
         **/
        r.push(
            new HtmlWebpackPlugin({
                filename: htmlName + '.html',
                chunks: [htmlName,'vendors'],
                template:filePath,
                inject:'head'
            })
        );
        //console.log(r)
    });
    !is_dev&& r.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
    return r;
};
gulp.task("webpack", function(callback) {    // run webpack
    var compiler = webpack({
        devtool:is_dev?"source-map":'',
        // configuration
        //页面入口文件配置
        entry: getEntry(),
        //入口文件输出配置
        output: {
            chunkFilename: "js/[id].chunk"+getHashName()+".js",
            path: path.join(__dirname, "dist/"),
            filename: 'js/[name]'+getHashName()+'.js'
        },
        //watch: true,
        amd: { jQuery: true},
        module: {
            //加载器配置
            loaders: [
                //{test: require.resolve('angular'), loader: 'expose?angular'},
                //{ test: /demo\.js$/, loader: "expose?demov" },
                //{ test: /angular\.js$/, loader: "expose?angular" },
                { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader",{publicPath : "../"}) },
                //{ test: /\.css$/, loader: "style-loader!css-loader" },
                //{ test: /\.js$/, loader: 'jsx-loader?harmony' },
                { test: /\.html/, loader: 'html-loader' },
                { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
                {test: /\.less$/, loader: "style!css!less"},
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=fonts/[name]"+getHashName()+".[ext]" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=fonts/[name]"+getHashName()+".[ext]" },
                { test: /\.(png|jpg)$/, loader: 'file-loader?name=img/[name]'+getHashName()+'.[ext]&limit=8192'}
            ]
        },
        externals: {
            //jQuery: 'jQuery' //或者jquery:'jQuery',
        },
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'],["normal", "loader"])
            ),
            //将公共代码抽离出来合并为一个文件
            new CommonsChunkPlugin({
                //minChunks: 0,
                //minChunks:3,
                name: "vendors",
                chunks:Object.keys(getEntry()),
                filename: "js/[name]"+getHashName()+".js"
            }),
            /**
            new CommonsChunkPlugin({
                //minChunks: 0,
                //minChunks:Infinity,
                name: "commons",
                chunks:["index",'vendors'],
                //chunks:["vendors","index"],
                filename: "js/[name]"+getHashName()+".js"
            }),
            new CommonsChunkPlugin({
                //minChunks: 0,
                //minChunks:Infinity,
                name: "commons2",
                chunks:["xx",'jquery'],
                //chunks:["vendors","index"],
                filename: "js/[name]"+getHashName()+".js"
            }),
             **/
        /** new CommonsChunkPlugin('commons','js/commons.js'),**/
            new ExtractTextPlugin("css/[name]"+getHashName()+".css"),
            /**
            new HtmlWebpackPlugin({
                filename: 'index.html',
                chunks: ['commons','index'],
                title: 'Hello World app',
                template:"src/index.html"
            }),
            new HtmlWebpackPlugin({
                filename: 'index2.html',
                chunks: ['commons2','xx'],
                title: 'Hello World appxx',
                template:"src/demo2.html"
            }),
             **/
            //provide $, jQuery and window.jQuery to every script
            new webpack.ProvidePlugin({
                //'angular': 'expose?angular!angular',
                //'demov': 'expose?demov!demo',
                //$: "jquery",
                //jQuery: "jquery",
                //"window.jQuery": "jquery"
            })
            /**,
            new BrowserSyncPlugin({
                // browse to http://localhost:3000/ during development,
                // ./public directory is being served
                host: 'localhost',
                port: 3000,
                server: { baseDir: ['dist'] }
            })**/
        ].concat(htmlGenerator()),
        //其它解决方案配置
        resolve: {
            modulesDirectories : [ 'node_modules', 'bower_components' ],
            root: './src', //绝对路径
            extensions: ['', '.js', '.json', '.scss','.css'],
            alias: {
                bower: bowerRoot,
                demo:path.resolve(__dirname,"./src/js/lib/demo"),
                angular:path.resolve(__dirname,"./bower_components/angular/angular.min"),
                jquery:path.resolve(__dirname,"./bower_components/jquery/jquery.min"),
                swiper_css:path.resolve(__dirname,"./bower_components/Swiper/dist/css/swiper.min"),
                swiper:path.resolve(__dirname,"./bower_components/Swiper/dist/js/swiper.min")
            }
        }
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    }).watch(100,function(err, stats) {
        console.log("------>")
    });;
});

gulp.task('watch', ['webpack'],function() {
    var s = server({
        watchCallBack:function(){
            //gulp.run("webpack")
        },
        dataSource:argv.s
    });
    var timer = null;
    // 看守所有.scss档
    gulp.watch('dist/**',{readDelay:100},function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            s.reload();
        },100)
    });
});


gulp.task('server', ['webpack'],function() {
    return server({
        watchCallBack:function(){
            //gulp.run("webpack")
        },
        dataSource:argv.s
    });
});
