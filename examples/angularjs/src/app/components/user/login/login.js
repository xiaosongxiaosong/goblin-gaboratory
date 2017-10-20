import angular from 'angular';
import uiRouter from 'angular-ui-router';
import loginComponent from './login.component';

const loginModule = angular.module('login', [
  uiRouter
])

  .component('login', loginComponent)

  .config(($stateProvider, $urlRouterProvider) => {
    'ngInject';

    $stateProvider.state('user.login', {
      url: '/login',
      component: 'login'
    });
    $urlRouterProvider.otherwise('/user/login');
  })

  .name;

export default loginModule;
