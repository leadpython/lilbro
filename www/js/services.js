angular.module('lilbro.services', [])

.factory('TargetSERVICES', function() {
  var targetServices = {};

  targetServices.targets = [
    {
      type: 'Credit Cards',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    },

    {
      type: 'Debit Cards',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    },
    
    {
      type: 'Local Business',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    },
    
    {
      type: 'Casinos',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    },
    
    {
      type: 'Drug Cartels',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    },
    
    {
      type: 'Covert Agencies',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    },
    
    {
      type: 'Multinational Corporations',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    },
    
    {
      type: 'World Bank',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    },
    
    {
      type: 'Black Hat Hackers',
      security: {
        passLength: 0,
        timeLimit: undefined,
        tries: 10
      },
      reward: {
        min: 0,
        max: 0
      },
      cost: {
        fee: 0,
        penalty: 0
      }
    }
  ];

  return targetServices;
})