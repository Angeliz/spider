var http=require('http');
var fs=require('fs');
var cheerio=require('cheerio');

var url='http://list.iqiyi.com/www/4/37-------------4-1-1-iqiyi--.html';
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
function insert (datalist) {
    //批量将数据插入数据表games
    //插入语句
    var addData = "insert into iqiyi1(`name`,`src`,`nums`) values ?";
    //调用query函数完成数据的插入
    connection.query(addData, [datalist], function (err, rows, fields) {
        if(err){
            console.log('INSERT ERROR - ', err.message);
            return;
        }
        // console.log("插入数据成功");
        return 0;
    });
}

function startRequest(url) {
    http.get(url,function (res) {
        var html='';
        res.setEncoding('utf-8');
        res.on('data',function (chunk) {
            html+=chunk;
        });
        res.on('end',function () {
            var $ = cheerio.load(html);
            // list是信息列表
            var list = $('.site-piclist').children();
            list.each(function (index,item) {
                var videoData=[];
                // console.log(item);'
                var src=$('.site-piclist_pic_link',this).attr('href');
                var name=$('.site-piclist_info_title ',this).children().first().text().split(" ").join("").replace("第1季","第一季").replace("第2季","第二季");
                // 集数
                var nums=$('.icon-vInfo',this).text().trim();
                // videoList.push({
                //     name:name,
                //     src:src,
                //     nums:nums,
                // });
                var video={
                    name:name,
                    src:src,
                    nums:nums,
                };
                videoData.push([video.name,video.src,video.nums]);
                if(videoData!==[]){
                    insert(videoData);
                }
            });
            // console.log(videoList);
            var nextLink='http://list.iqiyi.com'+$('.mod-page').children().last().attr('href');
            console.log(nextLink);
            if(nextLink!=="http://list.iqiyi.comundefined"){
                startRequest(nextLink);
            }else{
                console.log("存储数据结束");
                return 0;
            }
        })
    })
}

// 封装的函数
function fetchPage(url) {
    startRequest(url);
}
fetchPage(url);