angular.module('lilbro.controllers', [])

/////// MAIN CONTROLLER ///////
.controller('MainCONTROLLER', function($scope, $location, DataSERVICES) {
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    if (!DataSERVICES.amIFree()) {
      $location.path('/jail');
    }
    $scope.user = DataSERVICES.user;
    $scope.hasAlias = !DataSERVICES.noUser;
  });
  $scope.start = function() {
    DataSERVICES.resetUser();
    DataSERVICES.updateUsername($scope.user.username);
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
      image: 'img/target.png',
      clickEventHandler: function() {
        $location.path('/target');
      }
    },
    {
      name: 'how to play',
      image: 'img/question.png',
      clickEventHandler: function() {
        $location.path('/tutorial');
      }
    },
    {
      name: 'reset game',
      image: 'img/garbage.png',
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
    $ionicModal.fromTemplateUrl('templates/pop-templates/target-list.html', {
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
    DataSERVICES.updateFunds(-1 * target.fee);
    $scope.player = DataSERVICES.user;
    $scope.targetListModal.remove();
    $location.path('/hackSimulation');
  }
  $scope.$on('$destroy', function() {
    $scope.retrievingModal.remove();
    $scope.targetListModal.remove();
  });
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    if (!DataSERVICES.amIFree()) {
      $location.path('/jail');
    }
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
                      'lilbro_000@lilbro MINGW64 ~/root $ engage stage -all',
                      'Injection...COMPLETE',
                      'Encryption override...COMPLETE',
                      'Creating pointer to route...COMPLETE',
                      'Account drain module...READY',
                      'Loading hack interface...'];
var last3 = ['.',
             '.',
             '.',
             '.',
             '.',
             'Hacking interface successfully loaded!'];
  $scope.isAnimateCommandsDone = false;
  $scope.isLast3AnimationsDone = false;
  $scope.countdown = 3000;
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
        $location.path('/game');
        $interval.cancel($scope.animateCountdown);
      }
    }
  }, 10);

})

.controller('GameCONTROLLER', function($scope, $timeout, $interval, $location, DataSERVICES, TargetSERVICES, GameSERVICES) {
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    if (!DataSERVICES.amIFree()) {
      $location.path('/jail');
    }
    $scope.win = false;
    $scope.player = {};
    $scope.player.funds = DataSERVICES.user.funds;
    $scope.player.level = DataSERVICES.user.level;
    $scope.player.username = DataSERVICES.user.username;
    $scope.target = TargetSERVICES.currentTarget;
    $scope.clear();
    $scope.currentDigit = 0;
    $scope.toggledTools = {
      keypad: true,
      log: false
    };
  });

  $scope.log = [];

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
        $scope.disconnecting = true;
        var code = 'nmcli dev disconect iface eth0';
        $scope.disconnectCode = [];
        var i = 0;
        $scope.disconnectAnimation = $interval(function() {
          $scope.disconnectCode.push(code.split('')[i]);
          i++;
          if ($scope.disconnectCode.length >= code.split('').length) {
            $interval.cancel($scope.disconnectAnimation);
            $timeout(function() {
              $scope.aboutToDC = true;
              var percentage = 0;
              $scope.disconnectBar = function() {
                return 'width: ' + percentage + '%;';
              };
              $scope.disconnectBarAnimation = $interval(function() {
                percentage++;
                if (percentage >= 100) {
                  $scope.disconnectCode = [];
                  $scope.disconnecting = false;
                  $interval.cancel($scope.disconnectBarAnimation);
                  $location.path('/main');
                }
              }, 20);
            }, 1000);
          }
        }, 25);
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
        if ($scope.win) {
          DataSERVICES.updateFunds($scope.target.funds);
          if ($scope.target.imageUrl > $scope.player.level) {
            DataSERVICES.updateLevel($scope.target.imageUrl);
          }
          var max = $scope.target.funds;
          var min = 0;
          $scope.drainBar = function() {
            return 'width: ' + Math.floor(min / max) + '%;';
          };
          var increment = Math.floor($scope.target.funds * 0.02);
          $scope.showDrain = true;
          $scope.draining = true;
          $scope.drainAnimation = $interval(function() {
            if ($scope.target.funds < increment) {
              $scope.player.funds += $scope.target.funds;
              min = max;
              $scope.target.funds = 0;              
            } else {
              $scope.target.funds -= increment;
              $scope.player.funds += increment;
              min += increment;
            }
            if ($scope.target.funds <= 0) {
              $scope.draining = false;
              $scope.drained = true;
              $scope.target.funds = 0;    
              $scope.draining = false;
              $scope.drained = true;
              $scope.win = false;
              $interval.cancel($scope.drainAnimation);
            }
          }, 50);
        }
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
  $scope.drainingStyle = function() {
    if ($scope.draining) {
      return 'background: rgba(100,200,255,0.25); color: rgb(100,200,255);';
    } else {
      return 'background: rgb(25,25,25); color: green;';
    }
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
    if ($scope.log.length >= $scope.target.security.tries) {
      $scope.triggerLoss();
      return;
    }
  };
  $scope.winStyle = function(item) {
    if (item.name === 'drain') {
      if ($scope.win) {
        return 'background: rgba(100, 200, 255, 1); color: black;';
      } else {
        return 'background: red; color: black;';
      }
    } else if (item.name === 'disconnect') {
      if ($scope.drained) {
        return 'background: rgba(100, 200, 255, 1); color: black;';
      } else {
        return 'background: rgb(25,25,25); color: rgb(75,75,75);';
      }
    }
  };
  $scope.successEntryStyle = function(success) {
    if (success) {
      return 'border: 2px solid rgba(100,200,255,1); background: rgba(100,200,255,0.25);';
    } else {
      return 'border: 1px solid rgba(25,25,25,1); background: rgba(25,25,25,0.5);';
    }
  };
  $scope.triggerLoss = function() {
    DataSERVICES.chargeCrime($scope.target.jailTime * 60 * 1000);
    $location.path('/jail');
  };
  $scope.triggerWin = function() {
    $scope.win = true;
  };
})

.controller('JailCONTROLLER', function($scope, $interval, $location, DataSERVICES) {
  $scope.$on('$ionicView.enter', function() {
    console.log('jailed');
    DataSERVICES.loadUser();
    if (DataSERVICES.amIFree()) {
      $location.path('/main');
    }
    $scope.releaseDate = DataSERVICES.user.releaseDate;
    $scope.secondsLeft = $scope.getSeconds();
    $scope.animateTime = $interval(function() {
      $scope.getSeconds();
    }, 500);
  });
  $scope.$on('$destroy', function() {
    $interval.cancel($scope.animateTime);
  });
  $scope.getSeconds = function() {
    if (DataSERVICES.amIFree()) {
      $scope.secondsLeft = 0;
      $interval.cancel($scope.animateTime);
      $location.path('/main');
    } else {
      var currentDate = new Date();
      var millisecondsLeft = $scope.releaseDate.getTime() - currentDate.getTime();
      $scope.secondsLeft = Math.floor(millisecondsLeft / 1000);
    }
  };
})