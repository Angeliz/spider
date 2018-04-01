//   http://v.qq.com/x/list/cartoon?sort=18&offset=0&itype=-1&iarea=1
var http=require('http');
var fs=require('fs');
var cheerio=require('cheerio');

var url='http://list.iqiyi.com/www/4/37-------------11-1-1-iqiyi--.html';
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
            var list = $('.site-piclist').children();
            list.each(function (index,item) {
                // console.log(item);'
                id++;
                var src=$('.site-piclist_pic_link',this).attr('href');
                var name=$('.site-piclist_info_title ',this).children().first().text();
                // 集数
                var nums=$('.icon-vInfo',this).text().trim();
                videoList.push({
                    id:id,
                    name:name,
                    src:src,
                    nums:nums,
                    // score:score,
                    // count:count
                });
            });
            console.log(videoList);
            var nextLink='http://list.iqiyi.com'+$('.mod-page').children().last().attr('href');
            // // console.log(nextLink);
            startRequest(nextLink);
        })
    })
}

// 封装的函数
function fetchPage(url) {
    startRequest(url);
}
fetchPage(url);