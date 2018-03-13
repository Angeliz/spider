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
            let $ = cheerio.load(html);
            let imgSrc=$('#mmComponent_images_1').first();
            // let imgSrc=$('ul .dgControl_list').attr('class');
            console.log(imgSrc);
        });
    });
}
startRequest('https://cn.bing.com/images/search?q=诗人杜甫');