var https= require('https');
var fs=require('fs');
var cheerio = require('cheerio');
var request = require('request');
var errPoet=[];
var nums=0;
//读取本地json文件
var file="E:\\GitHub\\spider\\nodejs\\tang_poetry_poets.json";
var result=JSON.parse(fs.readFileSync(file));
console.log(result);
var poets=[];
var resultPoet=[];
fs.readFile('poet0.txt','utf-8',function (err,data) {
    if(err){
        console.log('读取txt文件错误'+err);
    }else{
        // console.log(data);
        resultPoet=data.split(',');
        // console.log(resultPoet);
        for(let i=0;i<result.length;i++){
            poets.push({
                name:result[i].name,
                name0:resultPoet[i]
            });
        }
        console.log(poets.length);
        // fetchPage();
    }
});

function startRequest(url,name) {
    url='https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=&sf=1&fmq=1521110825457_R&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&word=%E5%94%90%E6%9C%9D%E8%AF%97%E4%BA%BA'+url;
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
            var $ = cheerio.load(html);
            var script=$("script[src='//img1.bdstatic.com/static/searchresult/pkg/result_0301203.js']").next().html();
            var start=script.indexOf("\"hoverURL\":\"");
            var end=script.indexOf("\",",start);
            var imgSrc=script.slice(start+12,end);
            if(imgSrc===''){
                imgSrc='https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=217103281,1723291866&fm=27&gp=0.jpg';
            }
            console.log(imgSrc);

            //杜甫
            //输出   https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=242066900,1256322218&fm=27&gp=0.jpg
            //原来   https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3136166715,3214725646&fm=27&gp=0.jpg

            //李白
            //      https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3597144539,2985685517&fm=27&gp=0.jpg
            //      https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3840550024,4206323057&fm=11&gp=0.jpg
            savedImg(imgSrc,name);
            nums++;
            console.log(nums);
        });
    }).on('error',function (err) {
        console.log('http get错误'+err);
        errPoet.push(name);
    });
}
// 将图片资源存储在本地
function savedImg(src,title) {
    // 采用request模块，向服务器发起一次请求，获取图片资源
    request.head(src,function(err,ros,body){
        if(err!=null){
            console.log('图片存储错误'+err);
        }
    });
    request(src).pipe(fs.createWriteStream('./image/'+title+'.jpg'));
}
//封装的运行函数
var fetchPage=function () {
  // for(let i=0;i<500;i++){
  //     startRequest(poets[i].name0,poets[i].name);
  // }
  //   for(let i=500;i<1000;i++){
  //       startRequest(poets[i].name0,poets[i].name);
  //   }
  //   for(let i=1000;i<1500;i++){
  //       startRequest(poets[i].name0,poets[i].name);
  //   }
  //   for(let i=1500;i<2000;i++){
  //       startRequest(poets[i].name0,poets[i].name);
  //   }
    for(let i=2000;i<poets.length;i++){
        startRequest(poets[i].name0,poets[i].name);
    }
};