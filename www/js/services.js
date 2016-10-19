angular.module('lilbro.services', [])

.factory('TargetSERVICES', function() {
  var targetServices = {};

  var randomNumberGenerator = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  targetServices.currentTarget;
  targetServices.targets = {
    'Credit Cards': {
      type: 'Credit Cards',
      security: {
        passLength: 3,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 0,
        max: 5000
      },
      fee: 100,
      jailTime: 0.5,
      description: '',
      numOfResults: 15,
      imageUrl: 0
    },
    'Debit Cards': {
      type: 'Debit Cards',
      security: {
        passLength: 4,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 0,
        max: 25000
      },
      fee: 100,
      jailTime: 0,
      description: '',
      numOfResults: 15,
      imageUrl: 1
    },
    'Local Businesses': {
      type: 'Local Businesses',
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
      fee: 100,
      jailTime: 0,
      description: '',
      imageUrl: 2
    },
    'Casinos': {
      type: 'Casinos',
      security: {
        passLength: 6,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 50000,
        max: 5000000
      },
      fee: 100,
      jailTime: 0,
      description: '',
      numOfResults: 15,
      imageUrl: 3
    },
    'Drug Cartels': {
      type: 'Drug Cartels',
      security: {
        passLength: 7,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 100000,
        max: 100000000
      },
      fee: 100,
      jailTime: 0,
      description: '',
      numOfResults: 5,
      imageUrl: 4
    },
    'Covert Operatives': {
      type: 'Covert Operatives',
      security: {
        passLength: 7,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 500000,
        max: 120000000
      },
      fee: 100,
      jailTime: 0,
      description: '',
      numOfResults: 10,
      imageUrl: 5
    },
    'Multinational Corporations': {
      type: 'Multinational Corporations',
      security: {
        passLength: 7,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 50000000,
        max: 5000000000
      },
      fee: 100,
      jailTime: 0,
      description: '',
      numOfResults: 10,
      imageUrl: 6
    },
    'Central Banks': {
      type: 'Central Banks',
      security: {
        passLength: 7,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 1000000000,
        max: 20000000000
      },
      fee: 100,
      jailTime: 0,
      description: '',
      numOfResults: 5,
      imageUrl: 7
    },
    'Black Hat Hacker': {
      type: 'Black Hat Hacker',
      security: {
        passLength: 8,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 0,
        max: 50000000000
      },
      fee: 100,
      jailTime: 0,
      description: '',
      numOfResults: 3,
      imageUrl: 8
    }
  };

  targetServices.generateTarget = function(targetType) {
    var target = { accountNum: '' };
    for (var i = 0; i < 5; i++) {
      target.accountNum += randomNumberGenerator(1000, 9999);
      if (i < 4) {
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
    $window.localStorage.setItem('lilbro-jailTerm', JSON.stringify(dataServices.user.releaseDate.getTime()));
  };
  dataServices.loadUser = function() {
    dataServices.user.username = $window.localStorage.getItem('lilbro-username');
    dataServices.user.funds = Number($window.localStorage.getItem('lilbro-funds'));
    dataServices.user.level = Number($window.localStorage.getItem('lilbro-level'));
    dataServices.user.releaseDate = new Date(Number($window.localStorage.getItem('lilbro-jailTerm')));
    if (dataServices.user.username === null || dataServices.user.username === undefined || dataServices.user.username === '') {
      dataServices.resetUser();
    } else {
      dataServices.noUser = false;
    }
  };
  dataServices.resetUser = function() {
    dataServices.noUser = true;
    dataServices.user = {username: '', funds: 100, level: 0, releaseDate: new Date(0)};
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
  dataServices.amIFree = function() {
    var currentDate = new Date();
    return currentDate.getTime() >= dataServices.user.releaseDate.getTime();
  }
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