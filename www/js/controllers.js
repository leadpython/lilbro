angular.module('lilbro.controllers', [])

/////// MAIN CONTROLLER ///////
.controller('MainCONTROLLER', function($scope, $location) {
  $scope.$on('$ionicView.enter', function() {
    $scope.player = {};
    $scope.player.alias = "leadpython";
    $scope.player.funds = 0;
  });
  $scope.hasAlias = false;
  $scope.start = function() {
    $scope.hasAlias = true;
  };
  $scope.menuOptions = [
    {
      name: 'seek targets',
      image: '../img/target.png',
      clickEventHandler: function() {
        $location.path('/target');
      }
    },
    {
      name: 'how to play',
      image: '../img/question.png',
      clickEventHandler: function() {
        $location.path('/tutorial');
      }
    },
    {
      name: 'delete game',
      image: '../img/garbage.png',
      clickEventHandler: function() {
        $scope.hasAlias = false;
      }
    }
  ];
})

/////// TARGET CONTROLLER ///////
.controller('TargetCONTROLLER', function($scope, $location, $ionicModal, TargetSERVICES) {
  $scope.goToMain = function() {
    $location.path('/main');
  };
  $scope.targets = TargetSERVICES.targets;

  $scope.targetClickEventHandler = function(target) {
    $scope.selectedTarget = target;
    $ionicModal.fromTemplateUrl('../templates/pop-templates/targetInfo.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.targetInfoModal = modal;
      $scope.targetInfoModal.show();
    });
  }
});