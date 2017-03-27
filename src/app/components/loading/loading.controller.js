import uiRouter from 'angular-ui-router';
// import Data from '../../common/data/data';
// import { User, Data } from '../../common/common';

class LoadingController {
  constructor($state, $transitions, Data, User) {
    // console.log($state.params.from);
    debugger;
    // 初始化data namespace
    Data.init();
    // 根据页面类型进行处理：
    // 1. 用户登陆、注册、找回密码页面改变登陆检查返回值，返回原页面
    // 2. 其他页面进行登陆处理
    if (undefined !== $state.params.from && 0 === $state.params.from.find(/user/)){
      User.setNeedSignedIn();
      this.jump2Src();
      return;
    }
    
    // 检查用户名密码是否过期
    // 1. 用户信息过期的话进行判断页面类型，分享与广场类页面修改登陆检查返回值，返回原网页，其他页面跳转到登陆页
    // 2. 用户名未过期的话检查jwt是否过期，如果过期，更新jwt，成功后返回原网页，未过期直接返回原网页
    // 3. 启动定时器定时更新jwt
    let userInfo = Data.getItem('userInfo');
    if (undefined === userInfo || new Date().getTime() -  userInfo.ctime > 30 * 24 * 60 * 60 * 1000){
      if (User.needSignedIn()){
        this.jump2Login();
      } else {
        this.jump2Src();
      }
      return;
    }
    User.login(userInfo).then(function(){
      this.jump2Src();
    }, function(){
      this.jump2Login();
    });
  }

  jump2Login () {}

  jump2Src (){}
}

export default LoadingController;


