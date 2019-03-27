const http = require('http'),
    {extname} = require('path'),
    {execSync} = require('child_process'),
    fs = require('fs'),
    log = require('./log.js').debug('rpc:');

const mime={
    html:'text/html',
    css:'text/css',
    json:'application/json',
    js:'application/javascript',
    ico:'application/x-icon'
};
log(new Date().toLocaleTimeString());
var cwd = process.cwd();
var s = http.createServer((req,res)=>{
    if(req.method == 'POST' && req.url=='/rpc'){
        log(new Date().toLocaleTimeString() +': ' + req.url);
        res.writeHead(200,{'content-type':mime['json']})
        var data = '';
        req.on('data',chunk=>{
            data += chunk;
        })
        req.on('end',()=>{
            data = JSON.parse(data.toString());
            
            var result = '';
            if(data.cmd.slice(0,3).toLowerCase() == 'cd '){
                try{
                    process.chdir(data.cmd.slice(3));
                    cwd = process.cwd();
                }catch(err){
                    result = err;
                }
            }else{
                try{
                    result = execSync(data.cmd+' 2>&1').toString();
                }catch(err){
                    result = err;
                }
            }
            var resdata = {
                cwd:cwd,
                cmd:data.cmd,
                res:result
            }

            if(data){
                res.end(JSON.stringify(resdata));
            }
            else{
                res.end('{}');
            }
        })
    }
    else if(req.method == 'GET'){
        var _url = req.url == '/' ? '/rpc.html' : req.url;
        var ext = extname(_url).slice(1);
        res.writeHead(200,{'content-type':mime[ext]})
        _url = __dirname + _url;
        if(fs.existsSync(_url)){
            fs.createReadStream(_url).pipe(res);
        }
        else{
            res.end();
        }
    }
}).listen(9001,()=>{
    log('server is listen 9001');
})
process.on('uncaughtException',err=>{
    log(err);
})
