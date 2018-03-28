import angular from 'angular';
import ngResource from 'angular-resource';
import ResourceFactory from './resource.factory';

let resourceModule = angular.module('resource', [
  ngResource
])

.factory('Resource', ResourceFactory)
  
.name;

export default resourceModule;
