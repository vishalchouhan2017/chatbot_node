var Redis = require('ioredis');
var env = require('./env.js').env;

function getRedisConfig(env){
  if (env === 'prd') {
    return {
      sentinalConfig :     {
        sentinels: [{ host: '10.10.1.90', port: 26379 }, { host: '10.10.0.237', port: 26379 }, { host: '10.10.0.212', port: 26379 }],
        name: 'mymaster'
      },
      options : {
          password: 'A!rP@ssw0rdPrd',
          db:1
        },
    }
  } else if(env === 'stg') {
    return {
      sentinalConfig :     {
        sentinels: [{ host: '10.10.1.90', port: 26379 }, { host: '10.10.0.237', port: 26379 }, { host: '10.10.0.212', port: 26379 }],
        name: 'mymaster'
      },
      options : {
          password: 'A!rP@ssw0rdStg',
          db:1
        },
    }

    } else if(env === 'dev') {
    return {
      sentinalConfig :     {
        sentinels: [{ host: '10.10.1.90', port: 26379 }, { host: '10.10.0.237', port: 26379 }, { host: '10.10.0.212', port: 26379 }],
        name: 'mymaster'
      },
      options : {
          password: 'A!rP@ssw0rdDev',
          db:1
        },
    }

  
  } 
}
exports.getRedisConfig = getRedisConfig;


exports.getSessionEncryptionKey =function (env){
  if (env === 'prd') {
    return "A!r_auth_red1s_5e5510n_SecretKe7_prd";
  } else {
    return "A!r_auth_red1s_5e5510n_SecretKe7";
  }
}


exports.createRedisConn = function(callback) {
  var redisConfig = getRedisConfig(env);
  var redis = new Redis(redisConfig.sentinalConfig, redisConfig.options);

  redis.on('error', function(err) {
       console.log('Redis error: ' + err);
       callback(err);
  });

  redis.on('connect', function(err) {
       console.log('Connected to Redis');
       exports.redisConn = redis;
       callback();
  });


}
