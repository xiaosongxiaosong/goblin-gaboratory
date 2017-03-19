import angular from 'angular';
import uiRouter from 'angular-ui-router';
import testComponent from './test.component';

let testModule = angular.module('test', [
  uiRouter
])

.component('test', testComponent)

.name;

export default testModule;
