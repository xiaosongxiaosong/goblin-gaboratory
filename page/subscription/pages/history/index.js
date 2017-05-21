const Promise = require('../../../../util/bluebird.min');
const github = require('../../../../util/github');

Page({
  data: {
    issuesList: []
  },
  totle: 0,
  count: 0,
  onLoad: function () {

  },
  onShow: function () {
    this.data.issuesList = []
    this.load();
  },
  load: function () {
    var list = github.getSubs();
    this.totle = list.length;
    this.count = 0;

    if (0 === this.totle) {
      that.setData({
        issuesList: []
      });
    } else {
      list.map(this.get, this);
    }
  },
  get: function (item) {
    var that = this;
    github.getUserInfo(item).then(function (userinfo) {
      that.count = that.count + 1;
      userinfo = Object.assign({}, item, userinfo);
      return new Promise(function (resolve, reject) {
        github.getIssues(userinfo).then(function (issues) {
          issues.map(function (item) {
            item.created_at = item.created_at.split('T')[0];
            item.owner = userinfo.owner;
            item.repo = userinfo.repo;
          });
          return new Promise(function(resolve, reject){
            resolve(issues);
            return;
          });
        }).then(function (issues) {
          var tempList = that.data.issuesList;
          that.data.issuesList = tempList.concat(issues);
          resolve();
        }).catch(function(){
          reject();
          return;
        })
      });
    }).then(function () {
      that.setData({
        issuesList: issuesList.slice(0,100)
      });
    }).catch(function () {
      that.count = that.count + 1;
      console.log(that.data);
      that.setData({
        issuesList: that.data.issuesList.slice(2,100)
      });
    });
  }
})
