angular.module('lilbro.controllers', [])

/////// MAIN CONTROLLER ///////
.controller('MainCONTROLLER', function($scope, $location, DataSERVICES) {
  $scope.$on('$ionicView.loaded', function (viewInfo, state) {

  });
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    if (DataSERVICES.didPlayerCheat() === 'cheater') {
      DataSERVICES.chargeCrime(1 * 60 * 1000);
      $location.path('/jail');
    }
    if (!DataSERVICES.amIFree()) {
      $location.path('/jail');
    }
    $scope.user = DataSERVICES.user;
    $scope.hasAlias = !DataSERVICES.noUser;
  });
  $scope.start = function() {
    if ($scope.user.username === '' || $scope.user.username === undefined || $scope.user.username === null) {
      return;
    }
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
      name: 'black market',
      image: 'img/balance.png',
      clickEventHandler: function() {
        $location.path('/market');
      }
    },
    {
      name: 'hacker manual',
      image: 'img/laptop.png',
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
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    $scope.player = DataSERVICES.user;
    if (!DataSERVICES.amIFree()) {
      $location.path('/jail');
    }
  });
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
  $scope.canAfford = function(cost, index) {
    DataSERVICES.loadUser();
    $scope.player = DataSERVICES.user;
    return $scope.player.funds < cost && !$scope.lockLevel(index);
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
})

.controller('HackSimulationCONTROLLER', function($scope, $interval, $location, TargetSERVICES) {
  $scope.$on('$ionicView.enter', function() {
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
    }, 100);

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
  });
})

.controller('GameCONTROLLER', function($scope, $timeout, $interval, $location, DataSERVICES, TargetSERVICES, GameSERVICES) {
  $scope.$on('$ionicView.leave', function() {
    if ($scope.target.imageUrl >= $scope.player.level && $scope.win) {
      DataSERVICES.updateLevel($scope.target.imageUrl+1);
    }
  });
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.cheat();
    DataSERVICES.loadUser();
    if (!DataSERVICES.amIFree()) {
      $interval.cancel($scope.timeLeftAnimation);
      $location.path('/jail');
    }

    $scope.toolboxItems = [
      {
        name: 'DISRUPT COMMS',
        imageUrl: 'img/power.png',
        description: 'Disable target\'s defenses for 30 seconds.',
        getQuantity: function() {
          return DataSERVICES.user.disrupt;
        },
        effect: function() {
          if (DataSERVICES.user.disrupt <= 0) {
            return;
          }
          document.getElementById('game-toolbox').style.backgroundColor = 'rgb(25,25,25)';
          DataSERVICES.user.disrupt--;
          DataSERVICES.saveUser();
          $scope.toggledTools.toolbox = false;
          $scope.isDisrupted = true;
          $scope.disruptTimeLeft = 30000;
          $scope.disruptTimeLeftAnimation = $interval(function() {
            $scope.disruptTimeLeft -= 100;
            if ($scope.disruptTimeLeft <= 0) {
              $interval.cancel($scope.disruptTimeLeftAnimation);
            }
          }, 100);
          if ($scope.target.security.timeLimit) {
            $interval.cancel($scope.timeLeftAnimation);
            $timeout(function() {
              $scope.startTimeLimitAnimation();
              $scope.isDisrupted = false;
            }, 30000);
          }
          if ($scope.target.security.drainRate) {
            $interval.cancel($scope.defensiveDrainAnimation);
            $timeout(function() {
              $scope.startDefensiveDrain();
              $scope.isDisrupted = false;
            }, 30000);
          }
        }
      },
      {
        name: 'SPEED 2.0',
        imageUrl: 'img/syringe.png',
        description: 'Slow down perception of time by 25%.',
        getQuantity: function() {
          return DataSERVICES.user.speed;
        },
        effect: function() {
          if (DataSERVICES.user.speed <= 0) {
            return;
          }
          document.getElementById('game-toolbox').style.backgroundColor = 'rgb(25,25,25)';
          DataSERVICES.user.speed--;
          DataSERVICES.saveUser();
          $scope.toggledTools.toolbox = false;
          if (Math.random() <= 0.03) {
            $scope.timeColor = 'red';
            $scope.timeLimitSpeedMultiplier = 0.5;
          } else {
            $scope.timeColor = 'rgb(100,200,255)';
            $scope.timeLimitSpeedMultiplier = 1.25;
          }
          if ($scope.target.security.timeLimit === undefined) {
            $scope.timeColor = 'gray';
            $scope.timeLimitSpeedMultiplier = 1;
          }

          if ($scope.target.security.timeLimit) {
            $interval.cancel($scope.timeLeftAnimation);
            $scope.startTimeLimitAnimation();
          }
          if ($scope.target.security.drainRate) {
            $interval.cancel($scope.defensiveDrainAnimation);
            $scope.startDefensiveDrain();
          }
        }
      }
    ];

    // add time if user purchased time upgrade
    if (DataSERVICES.user.timeUpgrade === 1) {
      DataSERVICES.user.timeUpgrade = 0;
      DataSERVICES.saveUser();
      var bonusTime = 30;
    } else {
      var bonusTime = 0;
    }
    $scope.timeLimitSpeedMultiplier = 1;
    $scope.lost = false;
    $scope.win = false;
    $scope.player = {};
    $scope.player.funds = DataSERVICES.user.funds;
    $scope.player.level = DataSERVICES.user.level;
    $scope.player.username = DataSERVICES.user.username;
    $scope.target = TargetSERVICES.currentTarget;
    $scope.timeLeft = Number($scope.target.security.timeLimit) + bonusTime;
    if ( !($scope.timeLeft > 0) ) {
      $scope.timeLeft = undefined;
    }
    $scope.timeLeftString = 'X';
    $scope.clear();
    $scope.currentDigit = 0;
    $scope.log = [];
    $scope.aboutToDC = false;
    $scope.disconnecting = false;
    $scope.drained = false;
    $scope.draining = false;
    $scope.attemptsContainerArray = $scope.generateAttemptsContainer();
    $scope.lockedOut = false;
    $scope.toggledTools = {
      keypad: true,
      toolbox: false
    };
    $scope.toggleToolbox = function() {
      var toolboxBTN = document.getElementById('game-toolbox');
      if ($scope.toggledTools.toolbox) {
        toolboxBTN.style.backgroundColor = 'rgb(25,25,25)';
        $scope.toggledTools.toolbox = false;
      } else {
        toolboxBTN.style.backgroundColor = 'rgb(50,50,50)';
        $scope.toggledTools.toolbox = true;
      }
    };
    $scope.getTimeLeft = function() {
      if ($scope.timeLeft === undefined) {
        $scope.timeLeftString = '';
      } else {
        var timeLeftSeconds = $scope.timeLeft;
        var mins = Math.floor(timeLeftSeconds / 60.0);
        var seconds = Math.floor(timeLeftSeconds - (mins * 60));
        var minsString = '';
        var secondsString = '';
        if (seconds >= 10) {
          secondsString = `${seconds}`;
        } else {
          secondsString = `0${seconds}`;
        }
        if (mins >= 10) {
          minsString = `${mins}`;
        } else {
          minsString = `0${mins}`;
        }
        $scope.timeLeftString = `${minsString}:${secondsString}`;
      }
    };
    $scope.getTimeLeft(); 
    if ($scope.target.security.timeLimit === undefined) {
      $scope.timeColor = 'gray';
    } else {
      $scope.timeColor = '#00cc99';
    }
    $scope.startTimeLimitAnimation = function() {
      $scope.timeLeftAnimation = $interval(function() {
        if ($scope.timeLeft === undefined) {
          $interval.cancel($scope.timeLeftAnimation);
          return;
        }
        $scope.timeLeft--;
        $scope.getTimeLeft();
        if ($scope.timeLeft <= 0) {
          $scope.timeLeft = 0;
          $interval.cancel($scope.disconnectAnimation);
          $interval.cancel($scope.disconnectBarAnimation);
          $scope.triggerLoss();
        } else if ($scope.lost) {
          $interval.cancel($scope.timeLeftAnimation);
        }
      }, 1000 * $scope.timeLimitSpeedMultiplier);
    };
    $scope.startTimeLimitAnimation();
    $scope.startDefensiveDrain = function() {
      if ($scope.target.security.drainRate) {
        var decrement = Math.floor(($scope.target.funds * $scope.target.security.drainRate) / 10.0);
        if (decrement < 1) {
          decrement = 1;
        }
        $scope.defensiveDrainAnimation = $interval(function() {
          if (decrement >= $scope.target.funds) {
            $scope.target.funds = 0;
          } else {
            $scope.target.funds -= decrement;
          }
          if ($scope.target.funds <= 0) {
            $scope.drained = true;
            $scope.defensiveDrained = true;
            $interval.cancel($scope.defensiveDrainAnimation);
          }
        }, 100 * $scope.timeLimitSpeedMultiplier);
      }
    };
    $scope.startDefensiveDrain();
  });
  $scope.attemptsStyle = function(attempt) {
    if (attempt) {
      return 'background: red;';
    } else {
      return 'background: black;';
    }
  };
  $scope.generateAttemptsContainer = function() {
    var array = [];
    for (var i = 0; i < $scope.target.security.tries + DataSERVICES.user.bonusAttempts; i++) {
      array.push(false);
    }
    return array;
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
        var disconnectBTN = document.getElementsByClassName('ion-power')[0];
        if ($scope.clicked) {
          return;
        }
        // if we are locked out, then ok to disconnect
        if (!$scope.lockedOut) {
          if (!$scope.win) {
            return;
          }
        }
        $scope.clicked = true;
        disconnectBTN.style.backgroundColor = 'blue';
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
                  percentage = 0;
                  $scope.disconnecting = false;
                  $interval.cancel($scope.disconnectBarAnimation);
                  $interval.cancel($scope.timeLeftAnimation);
                  $scope.clicked = false;
                  DataSERVICES.unCheat();
                  $location.path('/main');
                }
              }, 10);
            }, 500);
          }
        }, 25);
      }
    },
    {
      name: 'keypad',
      ioniconTag: 'ion-calculator',
      clickHandler: function() {
        $scope.toggledTools.keypad = !$scope.toggledTools.keypad;
      }
    },
    {
      name: 'drain',
      ioniconTag: 'ion-nuclear',
      clickHandler: function() {
        var drainBTN = document.getElementsByClassName('ion-nuclear')[0];
        if ($scope.target.funds <= 0) {
          return;
        }
        if ($scope.win) {
          drainBTN.style.backgroundColor = 'blue';
          $interval.cancel($scope.defensiveDrainAnimation);
          DataSERVICES.updateFunds($scope.target.funds);
          var max = $scope.target.funds;
          var min = 0;
          $scope.drainBar = function() {
            return 'width: ' + Math.floor((min / max) * 100) + '%;';
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
              $scope.win = true;
              drainBTN.style.backgroundColor = 'rgba(255,100,100,0.25)';
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
    $scope.currentDigit = 0;
    $scope.toggledTools.keypad = false;
    if ($scope.lost || $scope.win) {
      return;
    }
    for (var i = 0; i < $scope.attemptsContainerArray.length; i++) {
      if ($scope.attemptsContainerArray[i] === false) {
        $scope.attemptsContainerArray[i] = true;
        break;
      }
    }
    var feedback = GameSERVICES.checkGuess($scope.guess.join(''));
    $scope.log.unshift(feedback);
    if (feedback.success) {
      $scope.triggerWin();
      $scope.toggledTools.keypad = false;
      return;
    }
    if ($scope.log.length >= $scope.attemptsContainerArray.length) {
      $scope.lockedOut = true;
      $scope.toggledTools.keypad = false;
      return;
    }
  };
  $scope.winStyle = function(item) {
    if (item.name === 'drain') {
      if ($scope.win && $scope.target.funds > 0) {
        return 'background: rgba(100,255,100,1); color: black; width: 25%;';
      } else {
        return 'background: rgba(255,100,100,0.25); color: black; width: 25%;';
      }
    } else if (item.name === 'disconnect') {
      if (($scope.drained || $scope.lockedOut) && $scope.defensiveDrained !== true) {
        return 'background: rgba(100,255,100,1); color: black; width: 25%;';
      } else if ($scope.target.funds <= 0 && $scope.win) {
        return 'background: rgba(100,255,100,1); color: black; width: 25%;';
      } else if ($scope.win) {
        return 'background: rgba(100,255,100,1); color: black; width: 25%;';
      } else {
        return 'background: rgba(255,100,100,0.25); color: black; width: 25%;';
      }
    } else if (item.name === 'keypad') {
      if ($scope.toggledTools.keypad) {
        return 'background: #00cc99; color: black; width: 50%;';
      } else {
        return 'background: rgba(25, 25, 25, 1); color: #00cc99; width: 50%;';
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
    $interval.cancel($scope.timeLeftAnimation);
    $scope.lost = true;
    $scope.timeBeforeJail = 3000;
    $scope.goToJailAnimation = $interval(function() {
      $scope.toggledTools.keypad = false;
      $scope.timeBeforeJail -= 10;
      $scope.goingToJail = true;
      if ($scope.timeBeforeJail <= 0) {
        $scope.goingToJail = false;
        $interval.cancel($scope.goToJailAnimation);
        DataSERVICES.unCheat();
        $location.path('/jail');
      }
    }, 10);
  };
  $scope.triggerWin = function() {
    $scope.win = true;
  };
  $scope.defensiveDrain = function() {
    if ($scope.target.security.drainRate === undefined) {
      return false;
    } else {
      return true;
    }
  };
})

.controller('JailCONTROLLER', function($scope, $interval, $location, TargetSERVICES, DataSERVICES) {
  $scope.$on('$ionicView.enter', function() {
    DataSERVICES.loadUser();
    if (DataSERVICES.amIFree()) {
      $location.path('/main');
    }
    if (DataSERVICES.didPlayerCheat() === 'cheater') {
      $scope.specialMessage = true;
    }
    $scope.username = DataSERVICES.user.username;
    $scope.funds = DataSERVICES.user.funds;
    $scope.releaseDate = DataSERVICES.user.releaseDate;
    $scope.timeLeftString = '0:00';
    $scope.costString = '0';
    $scope.secondsLeft = $scope.getSeconds();
    $scope.animateTime = $interval(function() {
      $scope.getSeconds();
      if ($scope.secondsLeft <= 0) {
        DataSERVICES.release();
        $interval.cancel($scope.animateTime);
        $location.path('/main');
      }
    }, 100);
  });
  $scope.$on('$destroy', function() {
    $interval.cancel($scope.animateTime);
  });
  $scope.getSeconds = function() {
    var currentDate = new Date();
    var millisecondsLeft = $scope.releaseDate.getTime() - currentDate.getTime();
    $scope.secondsLeft = Math.floor(millisecondsLeft / 1000);
    $scope.getTimeLeft();
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
  $scope.getTimeLeft = function() {
    var timeLeftSeconds = $scope.secondsLeft;
    $scope.costString = `${Math.floor(timeLeftSeconds * 75)}`;
    var mins = Math.floor(timeLeftSeconds / 60.0);
    var seconds = Math.floor(timeLeftSeconds - (mins * 60));
    var minsString = '';
    var secondsString = '';
    if (seconds >= 10) {
      secondsString = `${seconds}`;
    } else {
      secondsString = `0${seconds}`;
    }
    if (mins >= 10) {
      minsString = `${mins}`;
    } else {
      minsString = `0${mins}`;
    }
    $scope.timeLeftString = `${minsString}:${secondsString}`;
  };
  $scope.bribe = function() {
    if ($scope.funds >= Math.floor($scope.secondsLeft * 75)) {
      DataSERVICES.updateFunds(-1 * ($scope.secondsLeft * 75));
      DataSERVICES.release();
      $interval.cancel($scope.animateTime);
      $location.path('/main');
    }
  };
  $scope.exitSpecialMessage = function() {
    $scope.specialMessage = false;
  };
})

.controller('MarketCONTROLLER', function($scope, $location, DataSERVICES) {
  $scope.$on('$ionicView.enter', function() {

  });
  $scope.goToMain = function() {
    $location.path('/main')
  };
  $scope.getFunds = function() {
    return DataSERVICES.user.funds;
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
  $scope.products = [
    {
      name: 'UPGRADE HACKING TOOL',
      imageUrl: 'img/upgrade.png',
      description: 'Adds bonus password attempt permanently.',
      cost: function() {
        var quantityOwned = DataSERVICES.user.bonusAttempts;
        return 100 * Math.pow(10, quantityOwned);
      },
      getQuantity: function() {
        return DataSERVICES.user.bonusAttempts;
      },
      purchase: function(cost) {
        if (DataSERVICES.user.funds < cost) {
          return;
        }
        DataSERVICES.updateFunds(-1 * cost);
        DataSERVICES.addAttempts();
      }
    },
    {
      name: 'DISRUPT COMMS',
      imageUrl: 'img/power.png',
      description: 'Disable all target\'s defenses for 30 seconds.',
      cost: function() {
        return 30000;
      },
      getQuantity: function() {
        return DataSERVICES.user.disrupt;
      },
      purchase: function(cost) {
        if (DataSERVICES.user.funds < cost) {
          return;
        }
        DataSERVICES.updateFunds(-1 * cost);
        DataSERVICES.addDisrupt();        
      }
    },
    {
      name: 'SPEED 2.0',
      imageUrl: 'img/syringe.png',
      description: 'Slow down perception of time by 25%. Warning: 3% risk of speeding perception of time by 50%.',
      cost: function() {
        return 50000;
      },
      getQuantity: function() {
        return DataSERVICES.user.speed;
      },
      purchase: function(cost) {
        if (DataSERVICES.user.funds < cost) {
          return;
        }
        DataSERVICES.updateFunds(-1 * cost);
        DataSERVICES.addSpeed();  
      }
    },
    {
      name: 'BLACKMAIL',
      imageUrl: 'img/folder.png',
      description: 'Use to get out of jail for free.',
      cost: function() {
        return 100000;
      },
      getQuantity: function() {
        return DataSERVICES.user.blackmail;
      },
      purchase: function(cost) {
        if (DataSERVICES.user.funds < cost) {
          return;
        }
        DataSERVICES.updateFunds(-1 * cost);
        DataSERVICES.addBlackmail();
      }
    }
  ];

});



