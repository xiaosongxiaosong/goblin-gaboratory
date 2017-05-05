# 微信小程序从零开始

## 开始前的准备
- [小程序开发指导文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)

## 确定目标：实现一个博客订阅系统
### 博客订阅系统想法来源
目前有好多大神博客写在了GitHub上，watch的话每条评论都会收到，加上还有一些新手会在别人的博客中创建issue，导致一些不和谐，这样不好，正好再学习小程序，可以实现一个订阅器作为练习目标。

在公司项目中发现微信公众号提供发送模板消息的接口，考虑使用小程序作为订阅管理工具，订阅号来做消息推送工具。

### 博客系统构思
#### 1.1.x版本（Done）
1. 完全由小程序实现，默认有一些订阅，直接使用Github API获取数据，数据使用localStorage存储在本地
2. 打开小程序后显示博主列表，点击可以进入博主页，下方显示增加订阅按钮，点击可进入增加订阅页
3. 博主页上方显示博主信息，博主信息右侧有退订按钮，点击可以退订。下方显示博客列表，点击可以查看博客
4. 增加订阅通过输入Github参考
5. [source code](https://github.com/gtUserName/goblin-gaboratory/releases/tag/1.1.0)
6. 微信小程序中搜索订阅器

![微信小程序中搜索订阅器](./img/search-wxapp.png)
7. 扫描小程序码

![小程序码](./img/wxapp-code.jpg)

##### 参考资料
1. [Github API](https://developer.github.com/v3/)
2. [wxParse: wxParse-微信小程序富文本解析自定义组件，支持HTML及markdown解析](https://github.com/icindy/wxParse)
3. [小程序组建demo](https://mp.weixin.qq.com/debug/wxadoc/dev/demo.html)
4. [WeUI for 小程序](https://github.com/weui/weui-wxss)

#### 1.2.x版本（Doing）
1. 支持最新消息和历史消息
2. 支持tab导航
3. 最新消息显示所有博主最新博客
4. 历史消息显示所有博客
5. 阅读后自动标记为已读，博客列表中区分显示
6. 订阅号自定义菜单对应小程序tab入口
7. 思考如何推广订阅号，解锁微信认证

## 订阅号
由于个人未认证订阅号好多接口都没有办法调用，无法实现通过服务器去推送消息，暂时将订阅号仅作为小程序的入口。