const http = require('http');
const cheerio = require('cheerio');

let articleUrls = [];
function spider(){
    http.get('http://www.jianshu.com/u/452568260db5',(res)=>{
        let html = '';
        res.on('data',(data) => {
            console.log('开始获取作者主页信息...');
            html += data;
        })
        res.on('end',() => {
            console.log('获取作者主页信息成功');
            console.log(html);
        })
    }).on('error',() => {
        console.log('获取作者主页信息出错！');
    })
}
spider();
function getArticleUrls(html){
    let $ = cheerio.load(html);
    let titles = $('.note-list .title');
    titles.each((index) => {
        articleUrls.push($(titles[index]).attr('href'));
    })
    // console.log(articleUrls);
}