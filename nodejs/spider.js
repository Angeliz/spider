var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
// 数据计数器
var nums=0;
var nameErr=0;
// 初始化url
var url='http://store.steampowered.com/search/?filter=topsellers';
// 封装函数
function fetchPage(url) {
    startRequest(url);
}
// 请求并处理数据
function startRequest(url) {
    http.get(url,function (res) {
        var html='';
        //统一编码
        res.setEncoding('utf-8');
        // 监听data事件，每次获取一块数据
        res.on('data',function (chunk) {
            html+=chunk;
        });
        // 监听end事件，若整个HTML页面获取完毕，就执行回调函数
        res.on('end',function () {
            console.log('网页加载完毕');
            // 使用cheerio模块解析HTML
            var $ = cheerio.load(html);
            var list = $('#search_result_container div.search_rule').next().children().first().siblings();
            console.log(list.length);
            list.each(function (index,item) {
                var imgSrc=$('img',this).attr('src');
                var name=$('.title',this).text().trim();
                var sys=$('.title',this).next().children();
                var system=[];
                sys.each(function (x,item1) {
                    system.push($(item1).attr('class').split(' ').slice(1)+'');
                });
                system=system.join(',');
                var time=$('.search_released',this).text().trim();
                var price=$('div.search_price',this).text().trim();
                nums++;
                var game={
                    'id':nums,
                    'name':name,
                    'system':system,
                    'time':time,
                    'price':price
                };
                // console.log(imgSrc);
                console.log(game);
                savedImg(imgSrc,name);
            });
            var nextLink=$('div.search_pagination div.search_pagination_right').children().last().attr('href');
            // console.log(nextLink);
            if(nums<=1000){
                fetchPage(nextLink);
            }
        });
    }).on('error',function (err) {
        console.log(err);
    })
}
// 将内容资源存储在本地
function savedContent() {
    
}
// 将图片资源存储在本地
function savedImg(src,title) {
    // 采用request模块，向服务器发起一次请求，获取图片资源
    request.head(src,function(err,ros,body){
        console.log(err);
    });
    // if(!title.test(/[a-zA-Z]/)){
    //     title=nameErr+'';
    //     nameErr++;
    // }
    request(src).pipe(fs.createWriteStream('./image/'+title+'.png'));
    // request({uri: src, encoding: 'utf-8'}, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         fs.writeFile('./image/'+title+'.jpg', body, 'utf-8', function (err) {
    //             if (err) {console.log(err);}
    //         });
    //     }
    // });
}
//运行
fetchPage(url);