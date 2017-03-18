import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import Client from './client/client';

let componentModule = angular.module('app.components', [
  Home,
  About,
  Client
])

.name;

export default componentModule;
