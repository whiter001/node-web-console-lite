const http = require('http'),
    {extname} = require('path'),
    {execSync} = require('child_process'),
    fs = require('fs'),
    cluster = require('cluster'),
    log = require('./log.js').debug('rpc:');

const mime={
    html:'text/html',
    css:'text/css',
    json:'application/json',
    js:'application/javascript',
    ico:'application/x-icon'
};
var cwd = process.cwd();
if(cluster.isMaster){
    cluster.fork();
    cluster.fork();
    cluster.on('exit',(worker,code,signal)=>{
        log(`process worker ${worker.process.pid} is died!`)
    })
}
else if(cluster.isWorker){
    http.createServer((req,res)=>{
        if(req.method == 'POST' && req.url=='/rpc'){
            res.writeHead(200,{'content-type':mime['json']})
            var data = '';
            req.on('data',chunk=>{
                data += chunk;
            })
            req.on('end',()=>{
                log(new Date().toLocaleTimeString() +': ' + req.url + ' ' + data.toString());

                data = JSON.parse(data.toString());

                var result = '';
                var now = new Date();
                if(data.cmd.slice(0,3).toLowerCase() == 'cd '){
                    try{
                        process.chdir(data.cmd.slice(3));
                        cwd = process.cwd();
                    }catch(err){
                        if(err.code == 'ENOENT'){
                            result = `Error: ENOENT: no such file or directory, chdir '${err.path}'`
                        }
                    }
                }else{
                    try{
                        result = execSync(data.cmd+' 2>&1').toString() || '';
                    }catch(err){
                        log(err.stdout && err.stdout.toString() || err);
                        result = err.stdout && err.stdout.toString();
                    }
                }
                var resdata = {
                    cwd:cwd,
                    cmd:data.cmd,
                    time: (new Date() - now) / 1e3 + ' s',
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
        log(`worker:${process.pid} server is listen 9001`);
    })
}
process.on('uncaughtException',err=>{
    log(err);
})
