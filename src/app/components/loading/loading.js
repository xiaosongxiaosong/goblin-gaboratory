import angular from 'angular';
import uiRouter from 'angular-ui-router';
import loadingComponent from './loading.component';

const loadingModule = angular.module('loading', [
  uiRouter
])

.component('loading', loadingComponent)

.config(($stateProvider, $urlRouterProvider) => {
    'ngInject';
    $stateProvider
      .state('loading', {
        url: '/',
        component: 'loading'
      });
    $urlRouterProvider.otherwise('/');
  })

.name;

export default loadingModule;
