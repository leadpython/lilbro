angular.module('lilbro.services', [])

.factory('TargetSERVICES', function() {
  var targetServices = {};

  var randomNumberGenerator = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  targetServices.currentTarget;
  targetServices.targets = {
    'Credit Card': {
      type: 'Credit Card',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 0,
        max: 5000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: '',
      numOfResults: 15
    },

    'Debit Card': {
      type: 'Debit Card',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 7
      },
      reward: {
        min: 0,
        max: 25000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: '',
      numOfResults: 15
    },
    
    'Local Business': {
      type: 'Local Business',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 10
      },
      reward: {
        min: 10000,
        max: 500000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: ''
    },
    
    'Casino': {
      type: 'Casino',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 10
      },
      reward: {
        min: 50000,
        max: 5000000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: '',
      numOfResults: 15
    },
    
    'Drug Cartel': {
      type: 'Drug Cartel',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 10
      },
      reward: {
        min: 100000,
        max: 100000000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: '',
      numOfResults: 5
    },
    
    'Covert Operatives': {
      type: 'Covert Operatives',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 10
      },
      reward: {
        min: 500000,
        max: 120000000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: '',
      numOfResults: 10
    },
    
    'Multinational Corporation': {
      type: 'Multinational Corporation',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 10
      },
      reward: {
        min: 50000000,
        max: 5000000000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: ''
    },
    
    'World Bank': {
      type: 'World Bank',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 10
      },
      reward: {
        min: 1000000000,
        max: 20000000000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: '',
      numOfResults: 15
    },
    
    'Black Hat Hacker': {
      type: 'Black Hat Hacker',
      security: {
        passLength: 0,
        timeLimit: undefined,
        drainRate: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 50000000000
      },
      cost: {
        fee: 0,
        penalty: 0
      },
      jailTime: 0,
      description: '',
      numOfResults: 3
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
    target.funds = randomNumberGenerator(targetServices.targets[targetType].reward.min, targetServices.targets[targetType].reward.max);
    target.security = targetServices.targets[targetType].security;
    target.jailTime = targetServices.targets[targetType].jailTime;
    target.cost = targetServices.targets[targetType].cost;
    target.description = targetServices.targets[targetType].description;
    return target;
  };

  return targetServices;
})