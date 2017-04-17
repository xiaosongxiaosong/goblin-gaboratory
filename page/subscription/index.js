const Promise = require('../../util/bluebird.min');
const github = require('../../util/github');

Page({
  data: {
    list: []
  },
  totle: 0,
  count: 0,
  onLoad: function () {
    console.log('我的订阅');
    this.load();
  },
  load: function () {
    var list = github.getSubs();
    this.totle = list.length;
    this.count = 0;

    list.map(this.get, this);
  },
  get: function (item) {
    var list = this.data.list;

    var that = this;
    github.getUserInfo(item).then(function(userinfo){
      that.count = that.count + 1;

      userinfo = Object.assign({}, item, userinfo);
      list.push(userinfo);
      that.setData({
        list: list
      });
    }).catch(function(){
      that.count = that.count + 1;
    });
  }
})
