//   http://v.qq.com/x/list/cartoon?sort=18&offset=0&itype=-1&iarea=1
var http=require('http');
var fs=require('fs');
var cheerio=require('cheerio');

var url='http://v.qq.com/x/list/cartoon?sort=18&offset=0&itype=-1&iarea=1';
var videoList=[];
var id=0;

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
                videoList.push({
                    id:id,
                    name:name,
                    src:src,
                    nums:nums,
                    score:score,
                    count:count
                });
            });
            console.log(videoList);
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