angular.module('lilbro.controllers', [])

.controller('MainCONTROLLER', function($scope) {
  $scope.$on('$ionicView.enter', function() {
    $scope.hasAlias = true;
    $scope.player = {};
    $scope.player.alias = "leadpython";
    $scope.player.funds = 0;
  });
  $scope.menuOptions = [
    {
      name: 'seek targets',
      image: '../img/target.png'
    },
    {
      name: 'how to play',
      image: '../img/question.png'
    },
    {
      name: 'delete game',
      image: '../img/garbage.png'
    }
  ];
})