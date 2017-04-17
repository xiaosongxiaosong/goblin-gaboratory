const blogs = [
  'https://github.com/phodal/articles',
  'https://github.com/fouber/blog',
  'https://github.com/lifesinger/blog',
  'https://github.com/hax/hax.github.com',
  'https://github.com/FrankFang/best-chinese-front-end-blogs',
  'https://github.com/chemdemo/chemdemo.github.io',
  'https://github.com/ccforward/cc',
  'https://github.com/xufei/blog'
];
const github = require('../../util/github')

Page({
  data: {
    list: []
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        if (list[i].url) {
          wx.navigateTo({
            url: 'pages/' + list[i].url
          })
          return
        }
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  onLoad: function () {
    // debugger;
    console.log('onLoad');
    // blogs.map(this.get, this);
  },
  get: function (blog) {
    var list = this.data.list, _ = this;
    var info = github.parse(blog);
    if (null === info) {
      return;
    }

    var url = 'https://api.github.com/repos/' + info.owner + '/' + info.repo + '/issues';
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      success: function (res) {
        if (0 === res.data.length) {
          return;
        }
        var item = {
          id: info.owner,
          name: info.owner,
          open: false,
          pages: []
        };
        for (var i = 0, l = res.data.length; i < l; i++) {
          item.pages.push({
            zh: res.data[i].title,
            url: 'get-location/get-location'
          });
        }
        list.push(item);
        console.log(res.data)
        _.setData({
          list: list
        });
      }
    })
  }
})
