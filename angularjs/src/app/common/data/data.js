import angular from 'angular';
import DataFactory from './data.factory';

let dataModule = angular.module('data', [])

.factory('Data', DataFactory)
  
.name;

export default dataModule;