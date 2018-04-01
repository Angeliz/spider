var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var async = require("async");
//链接数据库时使用的数据格式
var gamelist=[];
// 数据计数器
var nums=0;
var nameErr=0;
// 初始化url
var url='http://store.steampowered.com/search/?filter=topsellers';

var mysql=require('mysql');
// 用createConnection方法创建一个表示与mysql数据库服务器之间连接的connection对象
var connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'steamGames'
});
connection.connect(function (err) {
    if(err){
        console.log('数据库连接失败：'+err);
    }else {
        console.log('数据库连接成功');
    }
});

// 请求并处理数据
function startRequest (url) {
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
            // console.log('网页加载完毕');
            // 使用cheerio模块解析HTML
            var $ = cheerio.load(html);
            // list是game信息列表
            var list = $('#search_result_container div.search_rule').next().children().first().siblings();
            // console.log(list.length);
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
                // nums++;
                var game={
                    // 'id':++nums,
                    'name':name,
                    'system':system,
                    'time':time,
                    'price':price
                };
                //game是对象格式
                // console.log(game);
                // savedContent(name,game);
                // savedImg(imgSrc,name);
                gamelist.push([game.name,game.system,game.time,game.price]);
            });
            insert(gamelist);
            var nextLink=$('div.search_pagination div.search_pagination_right').children().last().attr('href');
            // console.log(nextLink);
            // 通过nums控制爬取数量

            if(nums<=50){
                // gamelist=[];
                startRequest(nextLink);
            }

        });
    }).on('error',function (err) {
        console.log(err);
    })
}
// 将内容资源存储在本地
function savedContent(title,content) {
    fs.appendFile('./data/' + title + '.txt', content, 'utf-8', function (err) {
        if (err) {
            console.log(err);
        }
    });
}
// 将图片资源存储在本地
function savedImg(src,title) {
    // 采用request模块，向服务器发起一次请求，获取图片资源
    request.head(src,function(err,ros,body){
        console.log(err);
    });
    request(src).pipe(fs.createWriteStream('./image/'+title+'.png'));
}
// function con() {
//     console.log(gamelist);
// }
//连接mysql

function insert (gamelist) {
    //批量将数据插入数据表hotgames
    //插入语句
    var addData = "insert into games(`name`,`system`,`time`,`price`) values ?";
    //调用query函数完成数据的插入
    connection.query(addData, [gamelist], function (err, rows, fields) {
        if(err){
            console.log('INSERT ERROR - ', err.message);
            return;
        }
        console.log("插入数据成功");
        return 0;
    });
}
// 封装函数
function fetchPage (url) {
    startRequest(url);
}
//运行
fetchPage(url);
// connection.end();
