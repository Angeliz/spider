var http=require('http');
var cheerio=require('cheerio');

var url='http://list.youku.com/category/show/c_100_a_%E5%A4%A7%E9%99%86_s_1_d_2_p_1.html?spm=a2h1n.8251845.0.0';
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
    var addData = "insert into youku1(`name`,`src`,`nums`,`actor`,`play`) values ?";
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
            // console.log(html.length);
            var $ = cheerio.load(html);
            // list是信息列表
            var list = $('.panel').children();
            list.each(function (index,item) {
                var videoData=[];
                // console.log(item);'
                var src="http:"+$('.p-thumb',this).children().first().attr('href');
                var name=$('.title a',this).text().trim().split(" ").join("").replace("第1季","第一季").replace("第2季","第二季");
                // 播放量
                var play=$('.info-list',this).children().last().text().slice(0,-4);
                var actor=$('.actor',this).children().first().next().text()+","+$('.actor',this).children().first().next().next().text();
                // 集数
                var nums=$('.p-time ',this).children().last().text();
                if(src!=="http:undefined"){
                    // videoList.push({
                    //     name:name,
                    //     src:src,
                    //     nums:nums,
                    //     actor:actor,
                    //     play:play
                    // });
                    var video={
                        name:name,
                        src:src,
                        nums:nums,
                        actor:actor,
                        play:play
                    };
                    videoData.push([video.name,video.src,video.nums,video.actor,video.play]);
                    if(videoData!==[]){
                        insert(videoData);
                    }
                }
            });
            // console.log(videoList);
            var nextLink='http:'+$('.next a').attr('href');
            nextLink=nextLink.replace("大陆","%E5%A4%A7%E9%99%86");
            console.log(nextLink);
            if(nextLink!=="http:undefined"){
                startRequest(nextLink);
            }else {
                console.log("数据存储完毕");
                return 0;
            }
        });
    })
}

// 封装的函数
function fetchPage(url) {
    startRequest(url);
}
fetchPage(url);