# 从零开始 ```angular1.x es6 webpack2 component```

## 工具说明
- package管理使用的是 ```yarn```，可以将源指向阿里云 ```npm``` 镜像解决下载包慢的问题
- 打包工具使用 ```webpack2```


## Getting Start

### Step 1：初始化项目
使用 ```yarn init``` 命令初始化项目
```cmd
$ yarn init
yarn init v0.21.3
question name (goblin-gaboratory):
question version (1.0.0): 0.0.1
question description: 从零开始 angular1.x webpack component
question entry point (index.js):
question repository url (https://github.com/gtUserName/goblin-gaboratory.git):
question author (song <song.dxs@gmail.com>):
question license (MIT):
success Saved package.json
Done in 37.48s.

```
生成 ```package.json``` 文件：
```json
{
  "name": "goblin-gaboratory",
  "version": "0.0.1",
  "description": "从零开始 angular1.x webpack component",
  "main": "index.js",
  "repository": "https://github.com/gtUserName/goblin-gaboratory.git",
  "author": "song <song.dxs@gmail.com>",
  "license": "MIT"
}
```


### Step 2：初始化项目配置
1. 初始化 ```git``` 配置  
根目录下创建 ```.gitignore``` 文件，增加以下内容
```
node_modules/
.*
```
2. 安装 ```webpack```  
命令行输入
```
yarn add webpack --dev
```
3. 初始化 ```webpack``` 配置  
根目录下增加 ```webpack.config.js``` 文件
```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: './src/app/app.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist')
  }
};
```
4. add angular  
由于要配合 ```angular-material``` 使用，所以指定使用 ```angular@1.5.5``` 版本
```
yarn add angular@1.5.5 angular-animate@1.5.5  angular-aria@1.5.5 angular-messages@1.5.5 angular-material
```
5. 入口文件
```js
//src/app/app.js
import angular from 'angular';
console.log("Hello world!");
```
5. 运行 Hello world
```

```
### 
