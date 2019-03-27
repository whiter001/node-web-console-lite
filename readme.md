## node-web-console-lite

无依赖

## NODE_ENV的设置=号前后不能有空格
```bash
set NODE_ENV=dev && node -e "console.log(process.env.NODE_ENV,process.env.NODE_ENV=='dev')"
dev  false

set NODE_ENV=dev&& node -e "console.log(process.env.NODE_ENV,process.env.NODE_ENV=='dev')"
dev true

```
