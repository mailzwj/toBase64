# toBase64

图片（png/jpe?g）转换成base64格式，并通过tinypng接口压缩

## Usage

首先，下载代码：

```
git clone git@github.com:mailzwj/toBase64.git tinyimg
```

然后，前往[http://tinypng.com](http://tinypng.com)申请开发者账号（可申请免费账号，支持500张/月），并在项目根目录下创建`tmp`文件夹

接着，简单修改upload.php文件代码：

```
Tinify\setKey('YOUR_KEY'); // 填入你的开发者KEY
```

最后，将项目代码部署到php服务器上即可。

## 注意

1. 不要忘记创建`tmp`文件夹（读写权限），git不能提交空目录
2. 代码使用了FormData和FileReader，请注意浏览器支持情况
3. tinypng提供的php API有PHP环境要求，若使用过程中出现异常，请查询官方说明