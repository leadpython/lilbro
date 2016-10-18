angular.module('lilbro.controllers', [])

/////// MAIN CONTROLLER ///////
.controller('MainCONTROLLER', function($scope, $location, DataSERVICES) {
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    $scope.user = DataSERVICES.user;
    $scope.hasAlias = !DataSERVICES.noUser;
  });
  $scope.start = function() {
    DataSERVICES.resetUser();
    DataSERVICES.updateUsername($scope.user.username);
    DataSERVICES.saveUser();
    DataSERVICES.noUser = false;
    $scope.hasAlias = true;
    DataSERVICES.loadUser();
    $scope.user = DataSERVICES.user;
  };
  $scope.commafyNumber = function(num) {
    if (num === undefined) {
      return '';
    }
    var strArr = (num.toString()).split('');
    var commafied = [];
    for (var i = strArr.length-1, count = 1; i >= 0; i--, count++) {
      commafied.unshift(strArr[i]);
      if (count === 3 && i > 0) {
        count = 0;
        commafied.unshift(',');
      }
    }
    return commafied.join('');
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
      name: 'reset game',
      image: '../img/garbage.png',
      clickEventHandler: function() {
        $scope.hasAlias = false;
        $scope.user.username = '';
        DataSERVICES.resetUser();
      }
    }
  ];
})

/////// TARGET CONTROLLER ///////
.controller('TargetCONTROLLER', function($scope, $interval, $location, $ionicModal, GameSERVICES, DataSERVICES, TargetSERVICES) {
  $scope.progress = 0;
  $scope.targets = TargetSERVICES.targets;
  $scope.goToMain = function() {
    $location.path('/main');
  };
  $scope.targetClickEventHandler = function(target, index) {
    if ($scope.currentLevel < index) {
      return;
    }
    if ($scope.player.funds < target.fee) {
      return;
    }
    $scope.selectedTarget = target;
    $scope.progress = 0;;
    $ionicModal.fromTemplateUrl('../templates/pop-templates/target-list.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.isLoading = true;
      $scope.targetListModal = modal;
      $scope.targetList = [];
      $scope.generateTargetList = $interval(function() {
        if ($scope.targetList.length >= target.numOfResults) {
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
  $scope.lockLevel = function(index) {
    $scope.currentLevel = DataSERVICES.user.level;
    if ($scope.currentLevel >= index) {
      return false;
    } else {
      return true;
    }
  };
  $scope.commafyNumber = function(num) {
    if (num === undefined) {
      return '';
    }
    var strArr = (num.toString()).split('');
    var commafied = [];
    for (var i = strArr.length-1, count = 1; i >= 0; i--, count++) {
      commafied.unshift(strArr[i]);
      if (count === 3 && i > 0) {
        count = 0;
        commafied.unshift(',');
      }
    }
    return commafied.join('');
  };
  $scope.closeTargetList = function() {
    $scope.targetListModal.remove();
  };
  $scope.initiateGame = function(target) {
    GameSERVICES.generatePassword(target.security.passLength);
    TargetSERVICES.currentTarget = target;
    DataSERVICES.user.funds -= target.fee;
    $scope.player = DataSERVICES.user;
    DataSERVICES.saveUser();
    $scope.targetListModal.remove();
    $location.path('/hackSimulation');
  }
  $scope.$on('$destroy', function() {
    $scope.retrievingModal.remove();
    $scope.targetListModal.remove();
  });
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    $scope.player = DataSERVICES.user;
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
                      'Loading hack interface...'];
var last3 = ['.',
             '.',
             '.',
             'Hacking interface successfully loaded!'];
  $scope.isAnimateCommandsDone = false;
  $scope.isLast3AnimationsDone = false;
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
  }, 50);
  $scope.last3Animations = $interval(function() {
    if ($scope.isAnimateCommandsDone) {
      $scope.consoleOutput.push(last3[i]);
      i++;
      if (i > last3.length-1) {
        i=0;
        $scope.isLast3AnimationsDone = true;
        $interval.cancel($scope.last3Animations);
      }
    }
  }, 500);

  $scope.animateCountdown = $interval(function() {
    if ($scope.isLast3AnimationsDone) {
      $scope.countdown -= 10;
      if ($scope.countdown <= 0) {
        i=0;
        $interval.cancel($scope.animateCountdown);
        $location.path('/game');
      }
    }
  }, 10);

})

.controller('GameCONTROLLER', function($scope, DataSERVICES, TargetSERVICES, GameSERVICES) {
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    $scope.player = DataSERVICES.user;
    $scope.target = TargetSERVICES.currentTarget;
    $scope.clear();
    $scope.currentDigit = 0;
    // account num
    // funds
    // security
        //passLength
        //timeLimit
        //drainRate
        // tries
    // jail time
    // fee
    // description
    $scope.toggledTools = {
      keypad: true,
      log: false
    }
  });
  $scope.log = [];
  $scope.initializeArray = function(length) {
    var arr = [];
    for (var i = 0; i < length; i++) {
      arr.push('0');
    }
    return arr;
  }
  $scope.indicator = function(index) {
    if ($scope.currentDigit === index) {
      return '5px solid #00cc99';
    } else {
      return '0px';
    }
  }
  $scope.toolbarOptions = [
    {
      name: 'disconnect',
      ioniconTag: 'ion-power',
      clickHandler: function() {

      }
    },
    {
      name: 'keypad',
      ioniconTag: 'ion-calculator',
      clickHandler: function() {
        $scope.toggledTools.keypad = true;
        $scope.toggledTools.log = false;
      }
    },
    {
      name: 'log',
      ioniconTag: 'ion-clipboard',
      clickHandler: function() {
        $scope.toggledTools.keypad = false;
        $scope.toggledTools.log = true;
      }
    },
    {
      name: 'drain',
      ioniconTag: 'ion-nuclear',
      clickHandler: function() {
        
      }
    },
  ];
  $scope.commafyNumber = function(num) {
    if (num === undefined) {
      return '';
    }
    var strArr = (num.toString()).split('');
    var commafied = [];
    for (var i = strArr.length-1, count = 1; i >= 0; i--, count++) {
      commafied.unshift(strArr[i]);
      if (count === 3 && i > 0) {
        count = 0;
        commafied.unshift(',');
      }
    }
    return commafied.join('');
  };
  $scope.hitNum = function(num) {
    $scope.guess[$scope.currentDigit] = num.toString();
    $scope.moveSelector('right');
  };
  $scope.clear = function() {
    $scope.guess = [];
    for (var i = 0; i < $scope.target.security.passLength; i++) {
      $scope.guess.push('0');
    }
    $scope.currentDigit = 0;
  };
  $scope.moveSelector = function(direction) {
    if (direction === 'left') {
      if ($scope.currentDigit <= 0) {
        return;
      }
      $scope.currentDigit--;
    } else if (direction === 'right') {
      if ($scope.currentDigit >= $scope.guess.length-1) {
        return;
      }
      $scope.currentDigit++;
    }
  };
  $scope.checkGuess = function() {
    var feedback = GameSERVICES.checkGuess($scope.guess.join(''));
    $scope.log.unshift(feedback);
    if (feedback.success) {
      $scope.triggerWin();
      return;
    }
    if ($scope.log.length === $scope.target.security.tries) {
      $scope.triggerLoss();
      return;
    }
  };
  $scope.triggerLoss = function() {
    console.log('GAME OVER');
  };
  $scope.triggerWin = function() {
    console.log('YOU WIN');
  };
})