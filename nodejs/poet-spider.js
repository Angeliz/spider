var https= require('https');
var fs=require('fs');
var cheerio = require('cheerio');
var request = require('request');

//读取本地json文件
var file="E:\\GitHub\\spider\\nodejs\\tang_poetry_poets.json";
var result=JSON.parse(fs.readFileSync(file));
var poets=[];
// console.log(result);
for(let i=0;i<result.length;i++){
    poets.push(result[i].name);
}
// console.log(poets);
// https://baike.baidu.com/item/杜甫
function startRequest(url) {
    https.get(url,function (res) {
        var html='';
        //统一编码
        res.setEncoding('utf-8');
        // 监听data事件，每次获取一块数据
        res.on('data',function (chunk) {
            html+=chunk;
        });
        // 监听end事件，若整个HTML页面获取完毕，就执行回调函数
        res.on('end',function () {
            // console.log(html);
            console.log(html.length);
            var $ = cheerio.load(html);
            console.log('load ok');
            // var imgSrc=$('#imgid').children().first().children().last().attr('class');
            var list=$('#imgid').children().length;
            // var $=$(list);
            // var imgSrc=$('img.main_img');
            // var imgSrc=10;
            // list.each(function (index,item) {
            //     if(index===0){
            //         imgSrc=$('ul.imglist',this).length;
            //     }
            // });
            // // let imgSrc=$('ul .dgControl_list').attr('class');
            // console.log(123);
            console.log(list);
        });
    }).on('error',function (err) {
        console.log(err);
    });
}
startRequest('https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&sf=1&fmq=&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&fm=index&pos=history&word=诗人杜甫');