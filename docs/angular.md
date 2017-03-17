# 从零开始 angular1.x webpack component

## 工具说明
- package管理使用的是yarn，可以将源指向阿里云npm镜像解决下载包慢的问题
- 打包工具使用webpack

## Getting Start

### 第一步：初始化项目
使用 ```yarn init``` 命令初始化项目
```cmd
$ yarn init
yarn init v0.21.3
question name (goblin-gaboratory):
question version (1.0.0): 0.0.1
question description: 从零开始 angular1.x webpack component
question entry point (index.js):
question repository url (https://github.com/gtUserName/goblin-gaboratory.git):
question author (Kunkka <song.dxs@gmail.com>):
question license (MIT):
success Saved package.json
Done in 37.48s.

```
生成package.json文件：
```json
{
  "name": "goblin-gaboratory",
  "version": "0.0.1",
  "description": "从零开始 angular1.x webpack component",
  "main": "index.js",
  "repository": "https://github.com/gtUserName/goblin-gaboratory.git",
  "author": "Kunkka <song.dxs@gmail.com>",
  "license": "MIT"
}
```