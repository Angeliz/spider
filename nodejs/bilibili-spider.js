var https=require('https');
var page=1;

var url='https://bangumi.bilibili.com/web_api/season/index_cn?page=1&page_size=40&version=0&is_finish=0&start_year=0&tag_id=&index_type=1&index_sort=0';
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
    var addData = "insert into bilibili1(`name`,`src`) values ?";
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
    https.get(url,function (res) {
        var html='';
        res.setEncoding('utf-8');
        res.on('data',function (chunk) {
            html+=chunk;
        });
        res.on('end',function () {
            // console.log(html.length);
            var videoData=[];
            let json=JSON.parse(html).result.list;
            // console.log(json);
            for(let i=0;i<json.length;i++){
                videoData.push([
                    json[i].title.split(" ").join("").replace("第1季","第一季").replace("第2季","第二季"),  //name
                    json[i].url  //src
                ])
            }
            if(videoData!==[]){
                insert(videoData);
            }
            // console.log(videoList);
            page++;
            var nextLink='https://bangumi.bilibili.com/web_api/season/index_cn?page='+page+"&page_size=40&version=0&is_finish=0&start_year=0&tag_id=&index_type=1&index_sort=0";
            console.log(nextLink);
            if(page<=20){
                startRequest(nextLink);
            }else {
                console.log("数据存储完毕");
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