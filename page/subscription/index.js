const Promise = require('../../util/bluebird.min');
const github = require('../../util/github');

Page({
  data: {
    list: []
  },
  totle: 0,
  count: 0,
  onLoad: function () {
    
  },
  onShow: function () {
    this.data.list = []
    this.load();
  },
  load: function () {
    var list = github.getSubs();
    this.totle = list.length;
    this.count = 0;

    if (0 === this.totle){
      that.setData({
        list: []
      });
    } else {
      list.map(this.get, this);
    }
  },
  get: function (item) {
    var list = this.data.list;

    var that = this;
    github.getUserInfo(item).then(function (userinfo) {
      that.count = that.count + 1;

      userinfo = Object.assign({}, item, userinfo);
      list.push(userinfo);
      that.setData({
        list: list
      });
    }).catch(function () {
      that.count = that.count + 1;
      that.setData({
        list: list
      });
    });
  },
  add: function () {
    wx.navigateTo({
      url: 'pages/add/index'
    });
  }
})
