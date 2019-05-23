const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const phoneData = JSON.parse(json);


const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
   
    // HOMEPAGE:
   if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/template-homepage.html`, 'utf-8', (err, data) => {
            let homepageOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = phoneData.map(el => replaceTemplate(data, el)).join('');
                homepageOutput = homepageOutput.replace('{%CARDS%}', cardsOutput);
                res.end(homepageOutput);
            });    
        });
    } 

    // PHONE DETAILS PAGE:
    else if (pathName === '/phone' && id < phoneData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        
        fs.readFile(`${__dirname}/templates/template-phones.html`, 'utf-8', (err, data) => {
            const phone = phoneData[id];
            const output = replaceTemplate(data, phone);
            res.end(output);
        });
    } 

    // SERVE CSS FILES: 
    else if ((/\.css$/i).test(pathName)) {
        fs.readFile(`${__dirname}${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'text/css' });
            res.end(data);
        });
    }

    // SERVE IMAGE FILES:
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(data);
        });
    }

    // URL NOT FOUND:
    else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('URL was not found!!');
    }
  
});

    

server.listen(process.env.PORT || 1337, '127.0.0.1', () => {
    console.log('Listening..');
});


function replaceTemplate (originalHtml, phone) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, phone.productName);
    output = output.replace(/{%IMAGE%}/g, phone.image);
    output = output.replace(/{%DISPLAY%}/g, phone.display);
    output = output.replace(/{%CAMERA%}/g, phone.camera);
    output = output.replace(/{%MEMORY%}/g, phone.memory);
    output = output.replace(/{%CPU%}/g, phone.cpu);
    output = output.replace(/{%STORAGE%}/g, phone.storage);
    output = output.replace(/{%BATTERY%}/g, phone.battery);
    output = output.replace(/{%PRICE%}/g, phone.price);
    output = output.replace(/{%DESCRIPTION%}/g, phone.description);
    output = output.replace(/{%ID%}/g, phone.id);
    // using regular expressions above, because they might occur more than once in the code..
    return output;
}