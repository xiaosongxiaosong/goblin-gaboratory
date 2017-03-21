import angular from 'angular';
import Loading from './loading/loading';
import Client from './client/client';
import Project from './client/project/project';

const componentModule = angular.module('app.components', [
  Loading,
  Client,
  Project
])

.name;

export default componentModule;
