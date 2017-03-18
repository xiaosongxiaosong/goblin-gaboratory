import angular from 'angular';
import uiRouter from 'angular-ui-router';
// import ngComponentRouter from 'angular-new-router';
import ngMaterial from 'angular-material';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import 'angular-material/angular-material.min.css'

angular.module('app', [
    // ngComponentRouter,
    ngMaterial,
    Common,
    Components,
    uiRouter
  ])

  .component('app', AppComponent);
