import angular from 'angular';
import uiRouter from 'angular-ui-router';
import clientComponent from './client.component';
import Project from './project/project';

const clientModule = angular.module('client', [
  uiRouter,
  Project
])

  .component('client', clientComponent)

  .config(($stateProvider) => {
    'ngInject';
    $stateProvider
      .state('client', {
        url: '/client',
        component: 'client'
      });
  })

  .name;

export default clientModule;
