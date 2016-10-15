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
.controller('TargetCONTROLLER', function($scope, $interval, $location, $ionicModal, TargetSERVICES) {
  $scope.progress = 0;
  $scope.targets = TargetSERVICES.targets;
  $scope.goToMain = function() {
    $location.path('/main');
  };
  $scope.targetClickEventHandler = function(target) {
    $scope.selectedTarget = target;
    $scope.progress = 0;
    $ionicModal.fromTemplateUrl('../templates/pop-templates/target-list.html', {
      scope: $scope
    }).then(function(modal) {
       $scope.isLoading = true;
      $scope.targetListModal = modal;
      $scope.targetList = [];
      $scope.generateTargetList = $interval(function() {
        if ($scope.targetList.length >= 15) {
          $interval.cancel($scope.generateTargetList);
        }
        $scope.targetList.push(TargetSERVICES.generateTarget(target.type));
      }, 100);
      $scope.targetListModal.show();
    });
    $scope.loadingBar = $interval(function() {
      $scope.progress += 1;
      if ($scope.progress >= 100) {
        $scope.isLoading = false;
        $interval.cancel($scope.loadingBar);
      }
    }, 10);
  };
  $scope.commafyNumber = function(num) {
    var strArr = (num.toString()).split('');
    var commafied = [];
    for (var i = strArr.length-1, count = 1; i >= 0; i--, count++) {
      commafied.unshift(strArr[i]);
      if (count === 3 && i != 0) {
        count = 1;
        commafied.unshift(',');
      }
    }
    console.log(strArr);
    return commafied.join('');
  };
  $scope.closeTargetList = function() {
    $scope.targetListModal.remove();
  };
  $scope.initiateGame = function(target) {
    TargetSERVICES.currentTarget = target;
    $scope.targetListModal.remove();
    $location.path('/hackSimulation');
  }
  $scope.$on('$destroy', function() {
    $scope.retrievingModal.remove();
    $scope.targetListModal.remove();
  });
})

.controller('HackSimulationCONTROLLER', function($scope, $interval, $location, TargetSERVICES) {
  $scope.consoleOutput = [];
  var hackCommands = ['lilbro_000@lilbro MINGW64 ~/Desktop $ cd root/hack-executables',
                      'lilbro_000@lilbro MINGW64 ~/root $ stage sql-injection.exe',
                      'lilbro_000@lilbro MINGW64 ~/root $ stage encryption-override.exe',
                      'lilbro_000@lilbro MINGW64 ~/root $ set route -force fund-route.bat',
                      'lilbro_000@lilbro MINGW64 ~/root $ stage account-drain.exe',
                      'lilbro_000@lilbro MINGW64 ~/root $ run -all staged',
                      'Injection...COMPLETE',
                      'Encryption override...COMPLETE',
                      'Creating pointer to route...COMPLETE',
                      'Account drain module...READY',
                      'Loading hack interface...',
                      '.',
                      '.',
                      '.',
                      '.',
                      'Hacking interfaced successfully loaded!'];
  $scope.isAnimateCommandsDone = false;
  $scope.countdown = 5000;
  var i = 0;
  $scope.animateCommands = $interval(function() {
    if (i >= hackCommands.length) {
      i = 0;
      $scope.isAnimateCommandsDone = true;
      $interval.cancel($scope.animateCommands);
    } else {
      $scope.consoleOutput.push(hackCommands[i]);
      i++;
    }
  }, 100);

  $scope.animateCountdown = $interval(function() {
    if ($scope.isAnimateCommandsDone) {
      $scope.countdown -= 10;
      if ($scope.countdown <= 0) {
        $interval.cancel($scope.animateCountdown);
        $location.path('/game');
      }
    }
  }, 10);

});