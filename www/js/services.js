angular.module('lilbro.services', ['ngCordova'])

.factory('TargetSERVICES', function() {
  var targetServices = {};

  var randomNumberGenerator = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  targetServices.currentTarget = {};
  targetServices.targets = {
    'credit card': {
      type: 'credit card',
      security: {
        passLength: 3,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 0,
        max: 15000
      },
      fee: 150,
      jailTime: 0.5,
      description: '',
      numOfResults: 10,
      imageUrl: 0
    },
    'debit card': {
      type: 'debit card',
      security: {
        passLength: 4,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 5000,
        max: 25000
      },
      fee: 1500,
      jailTime: 1,
      description: '',
      numOfResults: 10,
      imageUrl: 1
    },
    'local business': {
      type: 'local business',
      security: {
        passLength: 5,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 10000,
        max: 500000
      },
      fee: 60000,
      jailTime: 5,
      description: '',
      numOfResults: 10,
      imageUrl: 2
    },
    'casino': {
      type: 'casino',
      security: {
        passLength: 5,
        timeLimit: 300,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 50000,
        max: 5000000
      },
      fee: 550000,
      jailTime: 10,
      description: '',
      numOfResults: 10,
      imageUrl: 3
    },
    'mafia': {
      type: 'mafia',
      security: {
        passLength: 5,
        timeLimit: 240,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 100000,
        max: 120000000
      },
      fee: 12000000,
      jailTime: 60,
      description: '',
      numOfResults: 10,
      imageUrl: 4
    },
    'covert operative': {
      type: 'covert operative',
      security: {
        passLength: 6,
        timeLimit: 180,
        drainRate: 0.0005,
        tries: 7
      },
      reward: {
        min: 500000,
        max: 1200000000
      },
      fee: 120000000,
      jailTime: 120,
      description: '',
      numOfResults: 10,
      imageUrl: 5
    },
    'multinational corporation': {
      type: 'multinational corporation',
      security: {
        passLength: 6,
        timeLimit: 150,
        drainRate: 0.001,
        tries: 7
      },
      reward: {
        min: 50000000,
        max: 5000000000
      },
      fee: 500000000,
      jailTime: 300,
      description: '',
      numOfResults: 10,
      imageUrl: 6
    },
    'central bank': {
      type: 'central bank',
      security: {
        passLength: 7,
        timeLimit: 120,
        drainRate: 0.0025,
        tries: 7
      },
      reward: {
        min: 1000000000,
        max: 20000000000
      },
      fee: 500000000,
      jailTime: 1440,
      description: '',
      numOfResults: 5,
      imageUrl: 7
    },
    'rogue hacker': {
      type: 'rogue hacker',
      security: {
        passLength: 8,
        timeLimit: 90,
        drainRate: 0.005,
        tries: 7
      },
      reward: {
        min: 5000000000,
        max: 50000000000
      },
      fee: 10000000000,
      jailTime: 4320,
      description: '',
      numOfResults: 1,
      imageUrl: 8
    }
  };

  targetServices.generateTarget = function(targetType) {
    var target = { accountNum: '' };
    for (var i = 0; i < 4; i++) {
      target.accountNum += randomNumberGenerator(1000, 9999);
      if (i < 3) {
        target.accountNum += '-';
      }
    }
    target.type = targetServices.targets[targetType].type;
    target.funds = randomNumberGenerator(targetServices.targets[targetType].reward.min, targetServices.targets[targetType].reward.max);
    target.security = targetServices.targets[targetType].security;
    target.jailTime = targetServices.targets[targetType].jailTime;
    target.fee = targetServices.targets[targetType].fee;
    target.description = targetServices.targets[targetType].description;
    target.imageUrl = targetServices.targets[targetType].imageUrl;
    return target;
  };

  return targetServices;
})

.factory('DataSERVICES', function($window) {
  var dataServices = {};
  dataServices.user = {};
  dataServices.noUser = true;
  dataServices.saveUser = function() {
    var data = dataServices.user;
    if (typeof data.releaseDate === "object") {
      data.releaseDate = data.releaseDate.getTime();
    }
    $window.localStorage.setItem('darknet-hacker-data', JSON.stringify(data));
  };
  dataServices.loadUser = function() {
    var data = JSON.parse($window.localStorage.getItem('darknet-hacker-data'));
    data.releaseDate = new Date(data.releaseDate);
    dataServices.user = data;
    if (dataServices.user.username === null || dataServices.user.username === undefined || dataServices.user.username === '') {
      dataServices.resetUser();
    } else {
      dataServices.noUser = false;
    }
  };
  dataServices.resetUser = function() {
    dataServices.noUser = true;
    dataServices.user = {
      username: '', 
      funds: 500, 
      level: 0, 
      releaseDate: new Date(0),
      disrupt: 0,
      speed: 0,
      bonusAttempts: 0,
      blackmail: 0
    };
    dataServices.saveUser();
  };
  dataServices.updateUsername = function(username) {
    dataServices.noUser = false;
    dataServices.user.username = username;
    dataServices.saveUser();
  };
  dataServices.updateFunds = function(money) {
    dataServices.user.funds += money;
    dataServices.saveUser();
  };
  dataServices.updateLevel = function(level) {
    dataServices.user.level = level;
    dataServices.saveUser();
  };
  dataServices.chargeCrime = function(jailTime) {
    jailTime = jailTime * 60 * 1000;
    dataServices.user.releaseDate = new Date((new Date()).getTime() + jailTime);
    dataServices.saveUser();
  };
  dataServices.release = function() {
    dataServices.unCheat();
    dataServices.user.releaseDate = new Date(0);
    dataServices.saveUser();
  };
  dataServices.amIFree = function() {
    var currentDate = new Date();
    return currentDate.getTime() >= dataServices.user.releaseDate.getTime();
  }
  dataServices.didPlayerCheat = function() {
    return $window.localStorage.getItem('lilbro-cheat');
  };
  dataServices.addDisrupt = function() {
    dataServices.user.disrupt++;
    dataServices.saveUser();
  };
  dataServices.addSpeed = function() {
    dataServices.user.speed++;
    dataServices.saveUser();
  };
  dataServices.addAttempts = function() {
    dataServices.user.bonusAttempts++;
    dataServices.saveUser();
  };
  dataServices.addBlackmail = function() {
    dataServices.user.blackmail++;
    dataServices.saveUser();
  };
  dataServices.cheat = function() {
    $window.localStorage.setItem('lilbro-cheat', 'cheater');
  };
  dataServices.unCheat = function() {
    $window.localStorage.setItem('lilbro-cheat', 'good');
  };
  return dataServices;
})

.factory('GameSERVICES', function() {
  var gameServices = {};
  var password = 0;
  gameServices.generatePassword = function(length) {
    var min = 1 * Math.pow(10, length-1);
    var max = 1 * Math.pow(10, length) - 1;
    password = Math.floor(Math.random() * (max - min + 1)) + min;
    password = password.toString().split('');
  };
  gameServices.getPass = function() {
    return password;
  };
  gameServices.checkGuess = function(guess) {
    var guessArr = guess.split('');
    var secretCodeArr = password.join('').split('');
    var feedback = {
      guess: guess,
      numPos: 0,
      numOnly: 0,
      success: false,
      date: new Date()
    };

    if (guess === password.join('')) {
      feedback.success = true;
    }

    for (var i = 0; i < guessArr.length; i++) {
      if (guessArr[i] === secretCodeArr[i] && guessArr[i] !== undefined) {
        feedback.numPos++;
        delete guessArr[i];
        delete secretCodeArr[i];
      }
    }

    for (var i = 0; i < guessArr.length; i++) {
      for (var j = 0; j < secretCodeArr.length; j++) {
        if (guessArr[i] === secretCodeArr[j] && guessArr[i] !== undefined) {
          feedback.numOnly++;
          delete guessArr[i];
          delete secretCodeArr[j];
        }
      }
    }
    return feedback;
  };

  return gameServices;
})

.factory('SoundSERVICES', function($cordovaNativeAudio) {
  var soundServices = {};
  soundServices.isEffectsMuted = false;

  soundServices.toggleMuteFX = function() {
    soundServices.isEffectsMuted = !soundServices.isEffectsMuted;
    if (soundServices.isEffectsMuted) {
      $cordovaNativeAudio.stop('hacker');
    } else {
      $cordovaNativeAudio.loop('hacker');
    }
  };
  soundServices.click = function() {
    if (soundServices.isEffectsMuted) {
      return;
    }
    // $cordovaNativeAudio.play('click');
  };
  soundServices.hack = function() {
    if (soundServices.isEffectsMuted) {
      return;
    }
    $cordovaNativeAudio.play('hack');
  };
  soundServices.shutdown = function() {
    if (soundServices.isEffectsMuted) {
      return;
    }
    $cordovaNativeAudio.play('shutdown');
  };
  soundServices.slomo = function() {
    if (soundServices.isEffectsMuted) {
      return;
    }
    $cordovaNativeAudio.play('slomo');
  };
  soundServices.staticFX = function() {
    if (soundServices.isEffectsMuted) {
      return;
    }
    $cordovaNativeAudio.play('static');
  };
  soundServices.buyFX = function() {
    if (soundServices.isEffectsMuted) {
      return;
    }
    $cordovaNativeAudio.play('buy');
  };
  soundServices.page = function() {
    if (soundServices.isEffectsMuted) {
      return;
    }
    $cordovaNativeAudio.play('page');
  };
  soundServices.caught = function() {
    if (soundServices.isEffectsMuted) {
      return;
    }
    $cordovaNativeAudio.play('caught');
  };

  return soundServices;
})