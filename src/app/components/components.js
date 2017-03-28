import angular from 'angular';
import Loading from './loading/loading';
import Client from './client/client';
import Project from './client/project/project';
import User from './User/User';

const componentModule = angular.module('app.components', [
  Loading,
  Client,
  Project,
  User
])

.name;

export default componentModule;
