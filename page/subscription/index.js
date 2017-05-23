const Promise = require('../../util/bluebird.min');
const github = require('../../util/github');

Page({
  data: {
    issuesList: []
  },
  totle: 0,
  count: 0,
  onLoad: function () {
    
  },
  onShow: function () {
    this.data.issuesList = [];
    this.load();
  },
  load: function () {
    var list = github.getSubs();
    this.totle = list.length;
    this.count = 0;
    var that = this;

    if (0 === this.totle) {
      that.setData({
        issuesList: []
      });
    } else {
      Promise.all(list.map(that.get, that))
        .then(function () {
          that.setData({
            issuesList: that.data.issuesList
          });
        }).catch(function (err) {
          console.log('catch exception' + err)
        })
    }
  },
  get: function (item) {
    var that = this;
    return github.getUserInfo(item).then(function (userinfo) {
      that.count = that.count + 1;
      userinfo = Object.assign({}, item, userinfo);
      return github.getIssues(userinfo).then(function (issues) {
        issues = issues.map(function (item) {
          var listItem = {};
          listItem.created_at = item.created_at.split('T')[0];
          listItem.owner = userinfo.owner;
          listItem.repo = userinfo.repo;
          listItem.number = item.number;
          listItem.title = item.title;
          listItem.avatar_url = item.user.avatar_url;
          listItem.login = item.user.login;
          listItem.id = item.id;
          listItem.isReaded = item.isReaded;
          return listItem;
        }).filter(function(item){
          return !item.isReaded;
        });

        var tempList = that.data.issuesList;
        that.data.issuesList = tempList.concat(issues);
        return new Promise(function (resolve, reject) {
          resolve();
        });
      })
    });
  }
})
