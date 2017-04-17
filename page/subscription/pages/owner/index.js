// const Promise = require('../../../../util/bluebird.min');
const github = require('../../../../util/github');

Page({
  data: {
    params: {},
    userinfo: {},
    issues: []
  },
  onLoad: function (params) {
    if (undefined === params) {
      console.log(error);
      return;
    }
    this.setData({
      params: params
    });

    let that = this;
    github.getUserInfo(params).then(function (userinfo) {
      that.setData({
        userinfo: userinfo
      });
    }).catch(function () {
      debugger;
    });

    github.getIssues(params).then(function (issues) {
      issues.map(function (item) {
        item.created_at = item.created_at.split('T')[0];
      });
      that.setData({
        issues: issues
      });
    }).catch(function () {
      debugger;
    });
  }
})
