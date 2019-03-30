const log = require('./log.js').debug('watcher:'),
    {watch} = require('fs'),
    {spawn} = require('child_process');
log('start..');
var cp;
var rpcpath = './src/rpc.js';
(function createNewProcess(){
    cp = spawn('node',[rpcpath]);
    cp.stdout.on('data',d=>{
        log(d.toString());
    })
    cp.stderr.on('data',err=>{
        log(err.toString())
    })
    cp.on('close',code=>{
        log('exit code:',code);
        var delay = code ? 5e3 : 0;
        setTimeout(createNewProcess,delay);
    })
})()

var ischanged = false;
var watcher = watch(rpcpath,(eventType,fileName)=>{
    if(+fileName > 0) return;
    if(ischanged) return;
    ischanged = setTimeout(()=>{
        log(fileName + ':changed');
        cp && cp.kill('SIGTERM');

        ischanged = false;
    },120)
})

process.on('SIGINT',()=>{
    process.exit();
})
process.on('exit',()=>{
    try{
        watcher && watcher.close();
    }catch(e){}
})
