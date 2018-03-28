import angular from 'angular';
import uiRouter from 'angular-ui-router';
import userComponent from './user.component';
import loginComponent from './login/login';

const userModule = angular.module('user', [
  uiRouter,
  loginComponent
])

  .component('user', userComponent)

  .config(($stateProvider, $urlRouterProvider) => {
    'ngInject';

    $stateProvider.state('user', {
      url: '/user',
      component: 'user'
    });
  })

  .name;

export default userModule;
