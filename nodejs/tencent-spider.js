//   http://v.qq.com/x/list/cartoon?sort=18&offset=0&itype=-1&iarea=1
var http=require('http');
var fs=require('fs');
var cheerio=require('cheerio');

var url='http://v.qq.com/x/list/cartoon?sort=18&offset=0&itype=-1&iarea=1';
var videoList=[];
var id=0;

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
function insert (gamelist) {
    //批量将数据插入数据表games
    //插入语句
    var addData = "insert into tencent(`name`,`src`,`nums`,`score`,`count`) values ?";
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

function startRequest(url) {
    http.get(url,function (res) {
        var html='';
        res.setEncoding('utf-8');
        res.on('data',function (chunk) {
            html+=chunk;
        });
        res.on('end',function () {

            // console.log(html.length);
            var $ = cheerio.load(html);
            // list是信息列表
            var list = $('.figures_list').children();
            list.each(function (index,item) {
                var videoData=[];
                // console.log(item);'
                id++;
                var src=$(item).children().first().attr('href');
                var name=$('.figure_title',this).children().first().text();
                // 评分
                var score=$('.score_l',this).text()+$('.score_s',this).text();
                // 播放量
                var count=$('.figure_count .num',this).text();
                // 集数
                var nums=$('.figure_info',this).text();
                video={
                    name:name,
                    src:src,
                    nums:nums,
                    score:score,
                    count:count
                };
                // videoList.push({
                //     // id:id,
                //     name:name,
                //     src:src,
                //     nums:nums,
                //     score:score,
                //     count:count
                // });
                videoData.push([video.name,video.src,video.nums,video.score,video.count]);
                if(videoData!==[]){
                    insert(videoData);
                }
            });
            // console.log(videoList);
            // insert(videoData);
            var nextLink='http://v.qq.com/x/list/cartoon'+$('.page_next').attr('href');
            // console.log(nextLink);
            startRequest(nextLink);
        })
    })
}

// 封装的函数
function fetchPage(url) {
    startRequest(url);
}
fetchPage(url);