import angular from 'angular';
import uiRouter from 'angular-ui-router';
// import ngComponentRouter from 'angular-new-router';
import ngMaterial from 'angular-material';
import ngResource from 'angular-resource';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import styles from './common/common.css';
// import 'angular-material/angular-material.min.css'

angular.module('app', [
  ngResource,
  uiRouter,
  ngMaterial,
  Common,
  Components
])

  .run(function ($transitions, $state, Data, Auth) {
    'ngInject';
    // 初始化data namespace
    Data.init();

    $transitions.onStart({
      to: 'client.**'
    }, (trans) => {
      if (true !== Auth.isSignedIn()) {
        debugger;
        return $state.target('loading', {
          from: trans.$to().name
        });
      } else {
        return true;
      }
    });
  })

  // .config(function ($mdThemingProvider) {
  //   $mdThemingProvider.theme('default')
  //     .primaryPalette('blue')
  //     ;
  // })

  .component('app', AppComponent);
