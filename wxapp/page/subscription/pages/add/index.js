// const Promise = require('../../../../util/bluebird.min');
const github = require('../../../../util/github');
const WxParse = require('../../../../util/wxParse/wxParse.js')

Page({
  data: {
    params: {},
    info: {}
  },
  onLoad: function (params) {
  },
  bindFormSubmit: function (e) {
    var info = github.parse(e.detail.value.textarea);
    if (null === info) {
      this.addError();
      return;
    }

    let that = this;
    github.getUserInfo(info).then(function (userinfo) {
      wx.showToast({
        title: '添加订阅成功',
        icon: 'success',
        duration: 2000,
        mask: true
      })
      github.addSub(info);
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    }).catch(function () {
      that.addError();
    });
  },
  addError: function () {
    wx.showToast({
      title: '添加订阅失败',
      icon: 'loading',
      duration: 2000,
      mask: true
    })
  }
})
