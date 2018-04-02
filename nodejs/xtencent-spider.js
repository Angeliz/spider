async = require("async");
var https=require('https');
var cheerio=require('cheerio');
var id=0;
// console.log(url);
var videoList=[];

var mysql=require('mysql');
// 用createConnection方法创建一个表示与mysql数据库服务器之间连接的connection对象
var connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'anime'
});
connection.connect(function (err) {
    if(err){
        console.log('数据库连接失败：'+err);
    }else {
        console.log('数据库连接成功');
    }
});

var tencentSrc=[];
var bilibiliSrc=[];
var iqiyiSrc=[];
var youkuSrc=[];
var tencent="tencent1";
var bilibili="bilibili1";
var iqiyi="iqiyi1";
var youku="youku1";

selectSrc = function(table,tableSrc) {
    return new Promise(function (resovle, reject) {
        var selectData = "select src from"+" "+table;
        // console.log(selectData);
        //调用query函数完成数据的选择
        connection.query(selectData,function (err, rows, fields) {
            if(err){
                console.log('SELECT ERROR - ', err.message);
                return;
            }
            for(let i=0;i<rows.length;i++){
                tableSrc.push(rows[i].src);
            }
            // console.log(tencentSrc);
            console.log("取出数据完成");
            resovle();
        });
    });
};


function startRequest(url) {
    https.get(url,function (res) {
        var html='';
        res.setEncoding('utf-8');
        res.on('data',function (chunk) {
            html+=chunk;
        });
        res.on('end',function () {
            // console.log(html.length);
            var $ = cheerio.load(html);
            // list是信息列表
            var name=$('.video_title a').text().split(" ").join("").replace("第1季","第一季").replace("第2季","第二季");
            var description=$('.summary').text().trim().split("\n").join("");
            var list=$('._video_tags').children('a');
            var time='';
            var label='';
            list.each(function (index,item) {
                if(index===1){
                    time=$(item).text();
                }else if(index===2){
                    label=$(item).text();
                }
            });

            // 调试
            videoList.push({
                'name': name,
                'description': description,
                'time': time,
                'label': label
            });
            console.log(videoList);

            // var video={
            //     'name': name,
            //     'description': description,
            //     'time': time,
            //     'label': label
            // };
            // videoData.push([video.name,video.time,video.lable,video.description]);
            // if(videoData!==[]){
            //     insert(videoData);
            // }

            var nextLink= tencentSrc[++id];
            // console.log(nextLink);
            startRequest(nextLink);
        })
    })
}
// 封装的函数
fetchPage = function() {
    return new Promise(function (resovle, reject) {
        var url=tencentSrc[id];
        // console.log(url);
        startRequest(url);
        resovle();
    });
};

fn = async function () {
    //这里需要同步加载
    await selectSrc(tencent,tencentSrc);
    await fetchPage();
}();
