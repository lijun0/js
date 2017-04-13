const http = require('http');
const cheerio = require('cheerio');
const baseUrl = 'http://www.jianshu.com/p/';
const articleIds = ['d05e902af678','89f1d4245b20','f2f5aca71fec','5b4c2f4c7a52','23454b4c899d','2f3bc2598dc5','3d4e8e2592a8','6958f99db769','a7d6077187d9','8e28be0e7ab1','95901615f322','3aa7de527e33','d36fb31f9cff']
const articlePromiseArray = [];
const nodemailer = require('nodemailer');

articleIds.forEach((item) => {
    articlePromiseArray
        .push(getPageAsync(baseUrl + item));
})
console.log(articlePromiseArray);

function getPageAsync(url){
    return new Promise((resolve,reject) => {
        http.get(url,(res) => {
            var html = '';
            res.on('data',(data) => {
                html += data;
            })
            res.on('end',() => {
                resolve(html);
            })
        }).on('error',(e) => {
            reject(e);
            console.log('获取信息出错!');
        })
    })
}
Promise
    .all(articlePromiseArray)
    .then(function onFullfilled(pages){
        let mailContent = '';
        pages.forEach((html) => {
            // console.log(html);
            let info = filterArticles(html)
            mailContent += info.title +'<br>'
        });
        console.log(mailContent);
        let transporter = nodemailer.createTransport({
            host:'smtp.163.com',
            secureConnection:true,
            port:465,
            auth:{
                user:'18270826122@163.com',
                pass:'zynuli1995'
            }
        });
        let mailOptions = {
            from:'18270826122@163.com',
            to:'759651849@qq.com',
            subject:'简书抓取，使用Promise',
            text:mailContent,
            html:'<b>' + mailContent + '</b>'
        }
        transporter.sendMail(mailOptions,(error,info) => {
            if(error){
                console.log(error);
            }else{
                console.log('Message sent：'+ info.response)
            }
        })
    },function onRejected(e){
        console.log(e);
    })
function filterArticles(html){
    let $ = cheerio.load(html)
    let title = $('.article .title').text();
    let publishTime = $('.publish-time').text();
    let textNum = $('.wordage').text().split('')[1];
    let articleData = {
        title,
        publishTime,
        textNum
    }
    return articleData;
}