const Promise = require('./bluebird.min');
const storage = require('./storage');
const api = 'https://api.github.com';

let parse = function (uri) {
  let m = uri.match(/^https\:\/\/github\.com\/([\w]+)\/([\w\-\.]+)(\/.*)?$/);
  if (null === m || m.length < 3) {
    return null;
  }
  return {
    owner: m[1],
    repo: m[2],
    uri: uri
  };
};

let getDefaultSubs = function () {
  let subs = [];
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
  for (let i = 0, l = blogs.length; i < l; i++) {
    let info = parse(blogs[i]);
    if (null !== info) {
      subs.push(info);
    }
  }
  return subs;
};

module.exports = {
  getSubs: function () {
    let subs = storage.get('subs');
    if (undefined === subs) {
      subs = getDefaultSubs();
      storage.set('subs', subs);
    }
    return subs;
  },
  addSub: function (info) {
    let subs = storage.get('subs');
    for (let i = 0, l = subs.length; i < l; i++) {
      if (subs[i].owner === info.owner && subs[i].repo === info.repo) {
        return subs;
      }
    }
    subs.push(info);
    storage.set('subs', subs);
    return subs;
  },
  delSub: function (info) {
    let subs = storage.get('subs');
    for (let i = 0, l = subs.length; i < l; i++) {
      if (subs[i].owner === info.owner && subs[i].repo === info.repo) {
        subs.splice(i, 1);
        break;
      }
    }
    storage.set('subs', subs);
    storage.remove(info.owner);
    return subs;
  },
  getUserInfo: function (info) {
    let owner = info.owner;
    let user = storage.get(info.owner);
    if (user && user.userinfo) {
      return new Promise(function (resolve, reject) {
        resolve(user.userinfo);
      });
    }

    return new Promise(function (resolve, reject) {
      let url = api + '/users/' + info.owner;
      wx.request({
        url: url,
        success: function (res) {
          storage.set(info.owner, {
            userinfo: res.data
          });
          resolve(res.data)
        },
        fail: function () {
          reject();
        }
      })
    });
  },
  getIssues: function (info) {
    let owner = info.owner;
    let user = storage.get(owner);
    if (user && user.issues && user.lastupdate 
    && (Date.parse(user.lastupdate) == Date.parse(new Date().toDateString()))) {
      return new Promise(function (resolve, reject) {
        resolve(user.issues);
      });
    }

    return new Promise(function (resolve, reject) {
      let url = api + '/repos/' + info.owner + '/' + info.repo + '/issues';
      wx.request({
        url: url,
        success: function (res) {

          storage.set(info.owner, {
            issues: res.data,
            lastupdate: new Date().toDateString()
          });
          resolve(res.data);
        },
        fail: function () {
          reject();
        }
      })
    });
  },
  getIssue: function (info) {
    let that = this;
    return new Promise(function (resolve, reject) {
      that.getIssues(info).then(function (issues) {
        let num = parseInt(info.number, 10);
        for (var i = 0, l = issues.length; i < l; i++) {
          if (num === issues[i].number) {
            resolve(issues[i]);
            return;
          }
        }
        reject();
      }).catch(function () {
        reject();
      });
    });
  },
  setIssueReaded: function (info) {
    let that = this;
    return new Promise(function (resolve, reject) {
      that.getIssues(info).then(function (issues) {
        let num = parseInt(info.number, 10);
        for (var i = 0, l = issues.length; i < l; i++) {
          if (num === issues[i].number) {
            issues[i].isReaded = true;
            storage.set(info.owner, {
              issues: issues,
            });
            resolve(issues[i]);
            return;
          }
        }
        reject();
      }).catch(function () {
        reject();
      });
    });
  },
  parse: function (uri) {
    return parse(uri);
  }
};