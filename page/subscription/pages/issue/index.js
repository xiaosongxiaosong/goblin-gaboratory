// const Promise = require('../../../../util/bluebird.min');
const github = require('../../../../util/github');
const WxParse = require('../../../../util/wxParse/wxParse.js')

Page({
  data: {
    params: {},
    info: {}
  },
  onLoad: function (params) {
    if (undefined === params) {
      return;
    }
    this.setData({
      params: params
    });

    let that = this;
    github.getIssue(params).then(function (issue) {
      issue.created_at = issue.created_at.split('T')[0];
      WxParse.wxParse('md', issue.body, that);
      that.setData({
        info: issue
      });

      wx.setNavigationBarTitle({
        title: issue.title
      });
    }).catch(function () {
    });
  },
  wxParseImgLoad: function (e) {
    var that = this
    WxParse.wxParseImgLoad(e, that)
  },
  wxParseImgTap: function (e) {
    var that = this
    WxParse.wxParseImgTap(e, that)
  }
})
