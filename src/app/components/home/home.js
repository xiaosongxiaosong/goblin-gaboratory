import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';

const homeModule = angular
  .module('home', [
    uiRouter
  ])
  
  .component('home', homeComponent)

  .config(($stateProvider, $urlRouterProvider) => {
    'ngInject';
    $stateProvider
      .state('home', {
        url: '/',
        component: 'home'
      });
    $urlRouterProvider.otherwise('/');
  })

  

  .name;

export default homeModule;