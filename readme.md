## node-web-console-lite
windows下的网页版远程命令行工具

## 使用
```
# 开发
npm run dev
# 使用
npm start

浏览器打开地址http://127.0.0.1:9001/
```

## 注释
#### NODE_ENV的设置=号前后不能有空格
```bash
set NODE_ENV=dev && node -e "console.log(process.env.NODE_ENV,process.env.NODE_ENV=='dev')"
dev  false

set NODE_ENV=dev&& node -e "console.log(process.env.NODE_ENV,process.env.NODE_ENV=='dev')"
dev true

```

不支持用cs的createNoWindow后台启动; 所以需要直接从命令行里直接启动
