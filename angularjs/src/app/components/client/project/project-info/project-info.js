import angular from 'angular';
import uiRouter from 'angular-ui-router';
import projectInfoComponent from './project-info.component';

const projectInfoModule = angular.module('project-info', [
  uiRouter
])

.component('projectInfo', projectInfoComponent)

.config(($stateProvider) => {
    'ngInject';
    $stateProvider
      .state('client.project.project-info', {
        url: '/project-info',
        component: 'projectInfo'
      });
  })

.name;

export default projectInfoModule;
