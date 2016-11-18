// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lilbro', ['ionic', 'lilbro.controllers', 'lilbro.services', 'ngCordova'])

.run(function($ionicPlatform, $cordovaNativeAudio) {
  var playBackgroundMusic = function() {
    $cordovaNativeAudio.loop('scifi');
  };
  $ionicPlatform.ready(function() {

    // SOUNDS
    $cordovaNativeAudio.preloadComplex('click', 'audio/click.wav', 1, 1);
    $cordovaNativeAudio.preloadComplex('hack', 'audio/hack.wav', 1, 1);
    $cordovaNativeAudio.preloadComplex('shutdown', 'audio/shutdown.wav', 1, 1);
    $cordovaNativeAudio.preloadComplex('slomo', 'audio/slomo.wav', 1, 1);
    $cordovaNativeAudio.preloadComplex('static', 'audio/copstatic.wav', 1, 1);
    $cordovaNativeAudio.preloadComplex('scifi', 'audio/scifi.mp3', 0.5, 1);
    $cordovaNativeAudio.preloadComplex('buy', 'audio/buy.mp3', 1, 1);

    setTimeout(playBackgroundMusic, 3000);

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'templates/main.html',
      controller: 'MainCONTROLLER'
    })
    .state('hud', {
      url: '/hud',
      templateUrl: 'templates/hud.html',
      controller: 'HUDCONTROLLER'
    })
    .state('target', {
      url: '/target',
      templateUrl: 'templates/target.html',
      controller: 'TargetCONTROLLER'
    })
    .state('game', {
      url: '/game',
      templateUrl: 'templates/game.html',
      controller: 'GameCONTROLLER'
    })
    .state('hackSimulation', {
      url: '/hackSimulation',
      templateUrl: 'templates/hackSimulation.html',
      controller: 'HackSimulationCONTROLLER'
    })
    .state('market', {
      url: '/market',
      templateUrl: 'templates/market.html',
      controller: 'MarketCONTROLLER'
    })
    .state('jail', {
      url: '/jail',
      templateUrl: 'templates/jail.html',
      controller: 'JailCONTROLLER'
    })
    .state('credits', {
      url: '/credits',
      templateUrl: 'templates/credits.html',
      controller: 'CreditsCONTROLLER'
    })
  $urlRouterProvider.otherwise('/main');
});