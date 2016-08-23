# webpack_demo
该项目为angular和webpack结合的项目脚手架工程，
初始启动的项目可以在改工程上搭建，做功能开发
本项目集成了以下功能
1.使用gulp和webpack结合编译项目，
2.使用browser-sync 做界面自动刷新，省去开发耗时
3.基本本地开发，只需要配置远程的数据接口地址，即可将远端rest接口数据代理到本地，前后端分离开发，大大提高开发效率

目录结构
webpack_demo
    bower_components  //bower下载的组件依赖
    dist   //dist目录问编译后的文件，一般用来发布，或者开发调试
    lib    //项目库文件，里面有一个server.js 用来拉起本地服务，使用browser-sync来做开发，调试，代理
    node_modules //nodejs依赖
    src  //项目统一源码
      css  //css文件
      images //图片
      js //js下放入口文件
        lib  //js类库
          common.js //公共类库
        index.js //入口js(多个入口并排放)
      index.html //这里放入口html模板（有多个入口都放这里）
    gulpfile.js  //gulp入口文件
    package.json //工程描述文件
    bower.json  
    

项目约束：

入口js的命名要和入口html文件名一致
如:index.html  入口js就是index.js
   abc.html  入口js就是abc.js
   
