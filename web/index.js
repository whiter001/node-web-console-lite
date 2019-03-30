const log = console.log.bind(console);
var macros = {
    a:'echo a',
    b:()=>'echo b',
    c:x=>`echo c,${x}`,
    speak:(...x)=>`speak -t "${x.join(' ')}"`,// 只能说英语,声音大
    ps:x=>`tasklist /fi "imagename eq ${x}.exe"`,
    kill:x=> `taskkill /f /im ${x}.exe`,
    speaks:(...x)=>`nircmdc speak -t "${x.join(' ')}"`, // 说中文,声音略小
};
var _cmds = '';
var _cmddatalist = ['chcp 65001'];
term.focus();
term.onkeydown=function(event){
    if(event.keyCode == 13){
        var _cmd = this.value.trim();
        if(_cmd == '') return;

        var _cmdarr = _cmd.split(' ');
        var _timeout = void(0);
        if(_cmdarr[0] === '1'){
            _timeout = +_cmdarr.shift();
            if(!_cmdarr.length) return;
        }
        
        if(!_cmddatalist.includes(_cmd)){
            _cmddatalist.push(_cmd);
            var _opt = `<option value="${_cmd}" />`;
            cmddatalist.innerHTML = _opt + cmddatalist.innerHTML;
        }
        var _his = `<li>${_cmd}</li>`;
        cmdhistory.innerHTML = _his + cmdhistory.innerHTML;

        var _q = _cmdarr[0],
            _args = _cmdarr.slice(1);
        if(typeof macros[_q] == 'string') {
            _cmd = macros[_q]
        }
        else if(typeof macros[_q] == 'function'){
            _cmd = macros[_q](..._args);
        }
        var d = {
            cmd:_cmdarr.join(' '),
            timeout: _timeout ? 2e3 : _timeout
        };


        this.value = '';

        fetch('/rpc',{
            method:'POST',
            mode:'cors',
            body:JSON.stringify(d),
            headers:{
                'content-type':'application/json'
            }
        }).then(d=>d.json())
            .then(res=>{
                var isfiles = Array.isArray(res.res);
                var template = `
        <div class="result">
        <div class="stdin">
        <span class="cwd">${res.cwd}&gt;</span>
            <span class="cmd">${res.cmd}</span></div>
        <pre class="stdout ${isfiles ? 'hide' : ''}">${isfiles || res.res.replace(/<DIR>/g,'[DIR]')}</pre>
        <div class="files ${isfiles ? '': 'hide' }">${isfiles && res.res.map(file=>`<a href="/files/${file}" target="_blank">${file}</a>`).join('')}</div>
        <dir class="time">${res.time}</dir>
    </div>`;
                result.innerHTML+=template;
                result.scrollTo(0,result.scrollHeight);
            })
    }
}

_cmddatalist.forEach(_cmd=>{
    cmddatalist.innerHTML += `<option value="${_cmd}" />`;
})
for(var key in macros){
    var li = `<li>${key}: ${macros[key].toString().replace(/\"/g,"'")} </li>`;
        macroslist.innerHTML += li;
    }

