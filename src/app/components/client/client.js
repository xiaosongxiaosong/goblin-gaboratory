import angular from 'angular';
import uiRouter from 'angular-ui-router';
import clientComponent from './client.component';

let clientModule = angular.module('client', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  // $urlRouterProvider.otherwise('/client');

  $stateProvider
    .state('client', {
      url: '/client',
      component: 'client'
    });
})

.component('client', clientComponent)
  
.name;

export default clientModule;
