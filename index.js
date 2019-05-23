const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const phoneData = JSON.parse(json);

const server = http.createServer((req, res) => {
    //console.log('Someone accessed the server :o');
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
   
   if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end('This is the products page..');
} 

else if (pathName === '/phone' && id < phoneData.length) {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.writeHead(200, { 'Content-type': 'text/css' });

    fs.readFile(`${__dirname}/templates/template-phones.html`, 'utf-8', (err, data) => {
        const phone = phoneData[id];
        let output = data.replace(/{%PRODUCTNAME%}/g, phone.productName);
        output = output.replace(/{%IMAGE%}/g, phone.image);
        output = output.replace(/{%DISPLAY%}/g, phone.display);
        output = output.replace(/{%CAMERA%}/g, phone.camera);
        output = output.replace(/{%MEMORY%}/g, phone.memory);
        output = output.replace(/{%CPU%}/g, phone.cpu);
        output = output.replace(/{%STORAGE%}/g, phone.storage);
        output = output.replace(/{%BATTERY%}/g, phone.battery);
        output = output.replace(/{%PRICE%}/g, phone.price);
        output = output.replace(/{%DESCRIPTION%}/g, phone.description);
        // using regular expressions above, because they might occur more than once in the code..
        res.end(output);
    });

    var fileC = fs.readFile(`./css/style2.css`, 'utf-8');
    res.write(fileC);
    res.end();
} 

else {
    res.writeHead(404, { 'Content-type': 'text/html'});
    res.end('URL was not found!!');
}
  
});

    

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening..');
});