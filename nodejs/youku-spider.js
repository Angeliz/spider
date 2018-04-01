//   http://v.qq.com/x/list/cartoon?sort=18&offset=0&itype=-1&iarea=1
var http=require('http');
var fs=require('fs');
var cheerio=require('cheerio');

var url='http://list.youku.com/category/show/c_100_a_%E5%A4%A7%E9%99%86_s_1_d_2_p_1.html?spm=a2h1n.8251845.0.0';
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
            var list = $('.panel').children();
            list.each(function (index,item) {
                // console.log(item);'
                // id++;
                var src="http:"+$('.p-thumb',this).children().first().attr('href');
                var name=$('.title a',this).text().trim();
                // 播放量
                var count=$('.info-list',this).children().last().text().slice(0,-4);
                var actor=$('.actor',this).children().first().next().text()+","+$('.actor',this).children().first().next().next().text();
                // 集数
                var nums=$('.p-time ',this).children().last().text();
                if(src!==undefined){
                    videoList.push({
                        id:++id,
                        name:name,
                        src:src,
                        nums:nums,
                        actor:actor,
                        // score:score,
                        count:count
                    });
                }

            });
            console.log(videoList);
            var nextLink='http:'+$('.next a').attr('href');
            nextLink=nextLink.replace("大陆","%E5%A4%A7%E9%99%86");
            // console.log(nextLink);
            startRequest(nextLink);
        });
    })
}

// 封装的函数
function fetchPage(url) {
    startRequest(url);
}
fetchPage(url);