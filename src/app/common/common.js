import angular from 'angular';
import Navbar from './navbar/navbar';
import Hero from './hero/hero';
import User from './user/user';
import Data from './data/data';
import Resource from './resource/resource';

let commonModule = angular.module('app.common', [
  Navbar,
  Hero,
  Resource,
  User,
  Data
])
  
.name;

export default commonModule;
