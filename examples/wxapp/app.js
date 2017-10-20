const openIdUrl = require('./config').openIdUrl

App({
  onLaunch: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  globalData: {
    hasLogin: false,
    openid: null,
    github:[
      'https://github.com/phodal/articles',
      'https://github.com/fouber/blog',
      'https://github.com/lifesinger/blog',
      'https://github.com/hax/hax.github.com',
      'https://github.com/FrankFang/best-chinese-front-end-blogs',
      'https://github.com/chemdemo/chemdemo.github.io',
      'https://github.com/ccforward/cc',
      'https://github.com/xufei/blog'
    ]
  },
  // lazy loading openid
  getUserOpenId: function(callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success: function(res) {
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function(res) {
              callback(res)
            }
          })
        },
        fail: function(err) {
          callback(err)
        }
      })
    }
  }
})
