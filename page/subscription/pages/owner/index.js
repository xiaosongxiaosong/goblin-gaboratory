// const Promise = require('../../../../util/bluebird.min');
const github = require('../../../../util/github');

Page({
  data: {
    params: {},
    userinfo: {},
    issues: [],
    loadding: true
  },
  onLoad: function (params) {
    if (undefined === params) {
      return;
    }
    this.data.params = params;
    this.setData({
      params: params
    });

    let that = this;
    github.getUserInfo(params).then(function (userinfo) {
      that.setData({
        userinfo: userinfo
      });
    }).catch(function () {
    });

    github.getIssues(params).then(function (issues) {
      issues.map(function (item) {
        item.created_at = item.created_at.split('T')[0];
      });
      that.setData({
        issues: issues
      });
    }).catch(function () {
    });
  },
  del: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认退订吗？',
      success: function(res) {
        if (res.confirm) {
          that.delSub();
        }
      }
    })
  },
  delSub: function () {
    let info = this.data.params;
    github.delSub(info);
    wx.showToast({
      title: '退订成功',
      icon: 'success',
      duration: 2000,
      mask: true
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 2000)
  }
})
