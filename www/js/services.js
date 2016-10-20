angular.module('lilbro.services', [])

.factory('TargetSERVICES', function() {
  var targetServices = {};

  var randomNumberGenerator = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  targetServices.currentTarget = {};
  targetServices.targets = {
    'Credit Card': {
      type: 'Credit Card',
      security: {
        passLength: 3,
        timeLimit: 600,
        drainRate: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 1000
      },
      fee: 100,
      jailTime: 1,
      description: '',
      numOfResults: 15,
      imageUrl: 0
    },
    'Debit Card': {
      type: 'Debit Card',
      security: {
        passLength: 4,
        timeLimit: 600,
        drainRate: undefined,
        tries: 5
      },
      reward: {
        min: 0,
        max: 15000
      },
      fee: 500,
      jailTime: 1.5,
      description: '',
      numOfResults: 15,
      imageUrl: 1
    },
    'Local Business': {
      type: 'Local Business',
      security: {
        passLength: 5,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 5
      },
      reward: {
        min: 10000,
        max: 500000
      },
      fee: 20000,
      jailTime: 5,
      description: '',
      imageUrl: 2
    },
    'Casino': {
      type: 'Casino',
      security: {
        passLength: 6,
        timeLimit: 420,
        drainRate: 0.005,
        tries: 5
      },
      reward: {
        min: 50000,
        max: 5000000
      },
      fee: 60000,
      jailTime: 10,
      description: '',
      numOfResults: 15,
      imageUrl: 3
    },
    'Drug Cartel': {
      type: 'Drug Cartel',
      security: {
        passLength: 7,
        timeLimit: 300,
        drainRate: 0.005,
        tries: 5
      },
      reward: {
        min: 100000,
        max: 100000000
      },
      fee: 120000,
      jailTime: 30,
      description: '',
      numOfResults: 5,
      imageUrl: 4
    },
    'Covert Operative': {
      type: 'Covert Operative',
      security: {
        passLength: 7,
        timeLimit: 300,
        drainRate: 0.01,
        tries: 5
      },
      reward: {
        min: 500000,
        max: 120000000
      },
      fee: 600000,
      jailTime: 60,
      description: '',
      numOfResults: 10,
      imageUrl: 5
    },
    'Multinational Corporation': {
      type: 'Multinational Corporation',
      security: {
        passLength: 7,
        timeLimit: 240,
        drainRate: 0.01,
        tries: 5
      },
      reward: {
        min: 50000000,
        max: 5000000000
      },
      fee: 5000000,
      jailTime: 75,
      description: '',
      numOfResults: 10,
      imageUrl: 6
    },
    'Central Bank': {
      type: 'Central Bank',
      security: {
        passLength: 7,
        timeLimit: 240,
        drainRate: 0.015,
        tries: 5
      },
      reward: {
        min: 1000000000,
        max: 20000000000
      },
      fee: 500000000,
      jailTime: 120,
      description: '',
      numOfResults: 5,
      imageUrl: 7
    },
    'Black Hat Hacker': {
      type: 'Black Hat Hacker',
      security: {
        passLength: 8,
        timeLimit: 90,
        drainRate: 0.02,
        tries: 5
      },
      reward: {
        min: 0,
        max: 50000000000
      },
      fee: 0,
      jailTime: 0,
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
    $window.localStorage.setItem('lilbro-username', dataServices.user.username);
    $window.localStorage.setItem('lilbro-funds', JSON.stringify(dataServices.user.funds));
    $window.localStorage.setItem('lilbro-level', JSON.stringify(dataServices.user.level));
    $window.localStorage.setItem('lilbro-high', JSON.stringify(dataServices.user.high));
    $window.localStorage.setItem('lilbro-timeUpgrade', JSON.stringify(dataServices.user.timeUpgrade));
    $window.localStorage.setItem('lilbro-bonusAttempts', JSON.stringify(dataServices.user.bonusAttempts));
    $window.localStorage.setItem('lilbro-jailTerm', JSON.stringify(dataServices.user.releaseDate.getTime()));
  };
  dataServices.loadUser = function() {
    dataServices.user.username = $window.localStorage.getItem('lilbro-username');
    dataServices.user.funds = Number($window.localStorage.getItem('lilbro-funds'));
    dataServices.user.level = Number($window.localStorage.getItem('lilbro-level'));
    dataServices.user.high = Number($window.localStorage.getItem('lilbro-high'));
    dataServices.user.timeUpgrade = Number($window.localStorage.getItem('lilbro-timeUpgrade'));
    dataServices.user.bonusAttempts = Number($window.localStorage.getItem('lilbro-bonusAttempts'));
    dataServices.user.releaseDate = new Date(Number($window.localStorage.getItem('lilbro-jailTerm')));
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
      funds: 300, 
      level: 0, 
      releaseDate: new Date(0),
      high: 0,
      timeUpgrade: 0,
      bonusAttempts: 5
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