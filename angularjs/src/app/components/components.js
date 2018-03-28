import angular from 'angular';
import Loading from './loading/loading';
import Client from './client/client';
import User from './User/User';

const componentModule = angular.module('app.components', [
  Loading,
  Client,
  User
])

.name;

export default componentModule;
