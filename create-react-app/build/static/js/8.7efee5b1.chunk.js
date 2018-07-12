webpackJsonp([8],{1302:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t(262),a=t.n(n),u=t(265),o=t.n(u),c=t(1390),s=t(1391);function p(e,r){var t={};for(var n in e)r.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}r.default={namespace:"users",state:{pageSize:20,list:[],page:1,total:void 0,keyword:void 0,loading:!1,selected:void 0,storageQuota:void 0,info:void 0},subscriptions:{setup:function(e){var r=e.dispatch;return e.history.listen(function(e){var t=e.pathname,n=t.match(/^\/p\/([\w-]+)\/events$/);if(n)return r({type:"init",payload:{projectName:n[1]}});var a=t.match(/^\/p\/([\w-]+)\/events\/([\w-]+)\//);return a?r({type:"getEventInfo",payload:{projectName:a[1],eventId:a[2]}}):void 0})}},effects:{init:a.a.mark(function e(r,t){var n,u,c,s=r.payload,p=t.put;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=o.a.parseUrl(window.location.href),u=n.query,c=parseInt(u.page||1,10),e.next=4,p({type:"save",payload:{keyword:u.keyword,page:c}});case 4:return e.next=6,p({type:"save",payload:{list:[],total:void 0}});case 6:return e.next=8,p({type:"getStorageQuota",payload:s});case 8:return e.next=10,p({type:"load",payload:s});case 10:case"end":return e.stop()}},e,this)}),getStorageQuota:a.a.mark(function e(r,t){var n,u,o,c,p=r.payload,i=t.call,f=t.put,v=t.select;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v(function(e){return e.events});case 2:if(n=e.sent,(u=n.storageQuota)&&u.project_name===p.projectName){e.next=13;break}return e.next=7,f({type:"save",payload:{storageQuota:void 0}});case 7:return e.next=9,i(s.a.getStorageQuota,p);case 9:return o=e.sent,c=o.data,e.next=13,f({type:"save",payload:{storageQuota:c||null}});case 13:case"end":return e.stop()}},e,this)}),load:a.a.mark(function e(r,t){r.payload;var n,u,o,s,p,i,f,v,d=t.call,l=t.put,m=t.select;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m(function(e){return e.events});case 2:if(n=e.sent,u=n.page,o=n.pageSize,s=n.keyword,!n.loading){e.next=9;break}return e.abrupt("return");case 9:return e.next=11,l({type:"save",payload:{loading:!0}});case 11:return e.next=13,m(function(e){return e.client});case 13:return p=e.sent,i=p.selected,e.next=17,d(c.a.getEvents,{projectName:i,keyword:s,start:(u-1)*o,limit:o});case 17:return f=e.sent,v=f.data,f.err,e.next=22,l({type:"save",payload:{loading:!1}});case 22:if(!v){e.next=26;break}return e.next=26,l({type:"save",payload:{list:v.list,total:v.total}});case 26:case"end":return e.stop()}},e,this)}),getEventInfo:a.a.mark(function e(r,t){var n,u,o=r.payload,c=t.put,s=t.select;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s(function(e){return e.events});case 2:if(n=e.sent,!(u=n.info)||o.eventId!==u.event_id){e.next=6;break}return e.abrupt("return");case 6:return e.next=8,c({type:"refreshEventInfo",payload:o});case 8:case"end":return e.stop()}},e,this)}),refreshEventInfo:a.a.mark(function e(r,t){var n,u,o=r.payload,s=t.call,p=t.put;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p({type:"save",payload:{info:void 0}});case 2:return e.next=4,s(c.a.getEvent,o);case 4:return n=e.sent,u=n.data,e.next=8,p({type:"save",payload:{info:u||null}});case 8:case"end":return e.stop()}},e,this)}),updateInfo:a.a.mark(function e(r,t){var n,u,o,c,s,i=r.payload,f=t.put,v=t.select;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v(function(e){return e.events});case 2:if(n=e.sent,u=n.info,o=i.eventId,c=i.projectName,s=p(i,["eventId","projectName"]),!u||c!==u.project_name||o!==u.event_id){e.next=8;break}return e.next=8,f({type:"save",payload:{info:Object.assign({},u,s)}});case 8:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,r){return Object.assign({},e,r.payload)}}}},1390:function(e,r,t){"use strict";var n=t(262),a=t.n(n),u=t(507);function o(e,r){var t={};for(var n in e)r.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}function c(e){return function(){var r=e.apply(this,arguments);return new Promise(function(e,t){return function n(a,u){try{var o=r[a](u),c=o.value}catch(e){return void t(e)}if(!o.done)return Promise.resolve(c).then(function(e){n("next",e)},function(e){n("throw",e)});e(c)}("next")})}}var s=function(){return Object(u.a)("/projects/:projectName/record/events/:eventId/:type")},p=function(){return Object(u.a)("/projects/:projectName/record/:resourceType/:resourceId/:action")};r.a={getEvents:function(){var e=c(a.a.mark(function e(r){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get(r));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getEvent:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.eventId;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t,eventId:n}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),updateEventInfo:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.eventId,u=o(r,["projectName","eventId"]);return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().put({projectName:t,eventId:n},u));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),createVodSession:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.eventId;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().post({projectName:t,eventId:n,type:"vod_sessions"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),removeEvent:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.eventId;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().remove({projectName:t,eventId:n}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),createMultiUploadSession:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.fileName,u=r.fileType;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",p().post({projectName:t,resourceType:"event_multipart_uploads"},{file_name:n,mime:u}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getMultiUploadSessionToken:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.eventId;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",p().post({projectName:t,resourceType:"event_multipart_uploads",resourceId:n,action:"token"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),updateMultiUploadSession:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.eventId;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",p().post({projectName:t,resourceType:"event_multipart_uploads",resourceId:n,action:"done"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),delMultiUploadSession:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.eventId;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",p().remove({projectName:t,resourceType:"event_multipart_uploads",resourceId:n}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),mergeEvents:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=o(r,["projectName"]);return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",p().post({projectName:t,resourceType:"merge_events"},n));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getTsUrl:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.eventId;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",p().get({projectName:t,resourceType:"events",resourceId:n,action:"ts_url"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}()}},1391:function(e,r,t){"use strict";var n=t(262),a=t.n(n),u=t(507);function o(e,r){var t={};for(var n in e)r.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}function c(e){return function(){var r=e.apply(this,arguments);return new Promise(function(e,t){return function n(a,u){try{var o=r[a](u),c=o.value}catch(e){return void t(e)}if(!o.done)return Promise.resolve(c).then(function(e){n("next",e)},function(e){n("throw",e)});e(c)}("next")})}}var s=function(){return Object(u.a)("/projects/:projectName/:resourcetype/:resourceId/:subType/:subId")};r.a={addVirtualCamera:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=o(r,["projectName"]);return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().post({projectName:t,resourcetype:"add_virtual_camera"},n));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getStorageQuota:function(){var e=c(a.a.mark(function e(r){var t=r.projectName;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t,resourcetype:"storage_quota"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getProjects:function(){var e=c(a.a.mark(function e(r){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get(r));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getProjectInfo:function(){var e=c(a.a.mark(function e(r){var t=r.projectName;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),updateProjectInfo:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=o(r,["projectName"]);return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().put({projectName:t},n));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getAccount:function(){var e=c(a.a.mark(function e(r){var t=r.projectName;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t,resourcetype:"account"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getQuota:function(){var e=c(a.a.mark(function e(r){var t=r.projectName;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t,resourcetype:"quota"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getOnlineSchoolConfig:function(){var e=c(a.a.mark(function e(r){var t=r.projectName;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t,resourcetype:"online_school",resourceId:"config"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getWechatMerchant:function(){var e=c(a.a.mark(function e(r){var t=r.projectName;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t,resourcetype:"wechat_merchant"}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getProjectUsers:function(){var e=c(a.a.mark(function e(r){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get(Object.assign({},r,{resourcetype:"users"})));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getProjectUserInfo:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.username;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t,resourcetype:"users",resourceId:n}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),addProjectUser:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.username,u=r.role;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().post({projectName:t,resourcetype:"users"},{username:n,role:u}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),removeProjectUser:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.username;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().remove({projectName:t,resourcetype:"users",resourceId:n}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getProjectUserRoles:function(){var e=c(a.a.mark(function e(r){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get(Object.assign({},r,{resourcetype:"user_roles"})));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getProjectUserRole:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.username;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get({projectName:t,resourcetype:"user_roles",resourceId:n}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),updateProjectUserRole:function(){var e=c(a.a.mark(function e(r){var t=r.projectName,n=r.username,u=r.role;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().put({projectName:t,resourcetype:"user_roles",resourceId:n},{role:u}));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),getProjectDevices:function(){var e=c(a.a.mark(function e(r){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",s().get(Object.assign({},r,{resourcetype:"devices"})));case 1:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}()}}});
//# sourceMappingURL=8.7efee5b1.chunk.js.map