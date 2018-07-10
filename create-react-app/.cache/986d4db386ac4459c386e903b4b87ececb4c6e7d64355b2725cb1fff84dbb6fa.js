{"source":"webpackJsonp([18],{1310:function(e,r,t){\"use strict\";Object.defineProperty(r,\"__esModule\",{value:!0});var n=t(262),l=t.n(n),a=t(265),s=t.n(a),m=t(1391),d=t(508);r.default={namespace:\"project-devices\",state:{pageSize:20,list:[],page:1,total:void 0,loading:!1},subscriptions:{setup:function(e){var a=e.dispatch;return e.history.listen(function(e){var r=e.pathname,t=e.search,n=r.match(/^\\/projects\\/([\\w-]+)\\/devices$/);if(n)return a({type:\"init\",payload:{projectName:n[1],search:t}})})}},effects:{init:l.a.mark(function e(r,t){var n,a,c=r.payload,u=t.put;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=s.a.parse(c.search),a=parseInt(n.page||1,10),e.next=4,u({type:\"save\",payload:{page:a,list:[],total:void 0}});case 4:return e.next=6,u({type:\"load\",payload:c});case 6:case\"end\":return e.stop()}},e,this)}),load:l.a.mark(function e(r,t){var n,a,c,u,s,o,p=r.payload,i=t.call,f=t.put,h=t.select;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h(function(e){return e[\"project-users\"]});case 2:if(n=e.sent,a=n.page,c=n.pageSize,!n.loading){e.next=8;break}return e.abrupt(\"return\");case 8:return e.next=10,f({type:\"save\",payload:{loading:!0}});case 10:return e.next=12,i(m.a.getProjectDevices,{start:(a-1)*c,limit:c,projectName:p.projectName});case 12:return u=e.sent,s=u.data,o=u.errMsg,e.next=17,f({type:\"save\",payload:{loading:!1,list:s&&s.list||null,total:s&&s.total}});case 17:o&&Object(d.c)(o,\"获取设备列表失败\");case 18:case\"end\":return e.stop()}},e,this)})},reducers:{save:function(e,r){return Object.assign({},e,r.payload)}}}},1391:function(e,r,t){\"use strict\";var n=t(262),c=t.n(n),a=t(507);function u(e,r){var t={};for(var n in e)0<=r.indexOf(n)||Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}function s(e){return function(){var s=e.apply(this,arguments);return new Promise(function(c,u){return function r(e,t){try{var n=s[e](t),a=n.value}catch(e){return void u(e)}if(!n.done)return Promise.resolve(a).then(function(e){r(\"next\",e)},function(e){r(\"throw\",e)});c(a)}(\"next\")})}}var o,p,i,f,h,l,m,d,v,j,y,g,w,N,b,x,k,P=function(){return Object(a.a)(\"/projects/:projectName/:resourcetype/:resourceId/:subType/:subId\")};r.a={addVirtualCamera:(k=s(c.a.mark(function e(r){var t=r.projectName,n=u(r,[\"projectName\"]);return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().post({projectName:t,resourcetype:\"add_virtual_camera\"},n));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return k.apply(this,arguments)}),getStorageQuota:(x=s(c.a.mark(function e(r){var t=r.projectName;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get({projectName:t,resourcetype:\"storage_quota\"}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return x.apply(this,arguments)}),getProjects:(b=s(c.a.mark(function e(r){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get(r));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return b.apply(this,arguments)}),getProjectInfo:(N=s(c.a.mark(function e(r){var t=r.projectName;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get({projectName:t}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return N.apply(this,arguments)}),updateProjectInfo:(w=s(c.a.mark(function e(r){var t=r.projectName,n=u(r,[\"projectName\"]);return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().put({projectName:t},n));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return w.apply(this,arguments)}),getAccount:(g=s(c.a.mark(function e(r){var t=r.projectName;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get({projectName:t,resourcetype:\"account\"}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return g.apply(this,arguments)}),getQuota:(y=s(c.a.mark(function e(r){var t=r.projectName;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get({projectName:t,resourcetype:\"quota\"}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return y.apply(this,arguments)}),getOnlineSchoolConfig:(j=s(c.a.mark(function e(r){var t=r.projectName;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get({projectName:t,resourcetype:\"online_school\",resourceId:\"config\"}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return j.apply(this,arguments)}),getWechatMerchant:(v=s(c.a.mark(function e(r){var t=r.projectName;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get({projectName:t,resourcetype:\"wechat_merchant\"}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return v.apply(this,arguments)}),getProjectUsers:(d=s(c.a.mark(function e(r){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get(Object.assign({},r,{resourcetype:\"users\"})));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return d.apply(this,arguments)}),getProjectUserInfo:(m=s(c.a.mark(function e(r){var t=r.projectName,n=r.username;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get({projectName:t,resourcetype:\"users\",resourceId:n}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return m.apply(this,arguments)}),addProjectUser:(l=s(c.a.mark(function e(r){var t=r.projectName,n=r.username,a=r.role;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().post({projectName:t,resourcetype:\"users\"},{username:n,role:a}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return l.apply(this,arguments)}),removeProjectUser:(h=s(c.a.mark(function e(r){var t=r.projectName,n=r.username;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().remove({projectName:t,resourcetype:\"users\",resourceId:n}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return h.apply(this,arguments)}),getProjectUserRoles:(f=s(c.a.mark(function e(r){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get(Object.assign({},r,{resourcetype:\"user_roles\"})));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return f.apply(this,arguments)}),getProjectUserRole:(i=s(c.a.mark(function e(r){var t=r.projectName,n=r.username;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get({projectName:t,resourcetype:\"user_roles\",resourceId:n}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return i.apply(this,arguments)}),updateProjectUserRole:(p=s(c.a.mark(function e(r){var t=r.projectName,n=r.username,a=r.role;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().put({projectName:t,resourcetype:\"user_roles\",resourceId:n},{role:a}));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return p.apply(this,arguments)}),getProjectDevices:(o=s(c.a.mark(function e(r){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt(\"return\",P().get(Object.assign({},r,{resourcetype:\"devices\"})));case 1:case\"end\":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})}}});"}