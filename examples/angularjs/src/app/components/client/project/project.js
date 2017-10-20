import angular from 'angular';
import uiRouter from 'angular-ui-router';
import projectComponent from './project.component';
import projectInfo from './project-info/project-info';

const projectModule = angular.module('project', [
  uiRouter,
  projectInfo
])

  .component('project', projectComponent)

  .config(($stateProvider) => {
    'ngInject';
    $stateProvider
      .state('client.project', {
        url: '/project/:project_name',
        component: 'project'
      });
  })
  
  .name;

export default projectModule;
