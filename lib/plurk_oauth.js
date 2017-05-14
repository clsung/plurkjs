var util = require('util')
  , redis = require('redis')
  , conf = require('./key')
  , oauth = require('oauth')
  , helper = require('./helper')
  ;

var client = redis.createClient();
var oa= new oauth.OAuth('https://www.plurk.com/OAuth/request_token',
                  'https://www.plurk.com/OAuth/access_token',
                  conf.plurk.consumerKey,
                  conf.plurk.consumerSecret,
                  '1.0',
                  null,
                  'HMAC-SHA1')

var oauth_access_token = '';
var oauth_access_token_secret = '';
var authorize_url = '';

function authorize(path, params, callback) {
  client.get('plurk_oauth_token', function (err, reply) { 
    if (reply) {
      util.puts('setting access_token');
      oauth_access_token = reply.toString();
      client.get('plurk_oauth_token_secret', function (err, reply) {
        if (reply) {
	  util.puts('setting access_token_secret');
          oauth_access_token_secret = reply.toString();
          oa.post(path,
	      oauth_access_token,
	      oauth_access_token_secret,
	      params,
	      'application/json',
	      callback
	      );
        } else
          oa.getOAuthRequestToken(requestTokenCallback);
      });
    } else {
      oa.getOAuthRequestToken(requestTokenCallback);
    }
  });
  client.end();
}

function callAPI(path, params, callback) {
  util.puts('calling ' + path);
  authorize(path, params, callback);
}

function requestTokenCallback(error, oauth_token, oauth_token_secret, results) {
  if(error) util.puts('error :' + error)
  else { 
    util.puts('oauth_token :' + oauth_token)
    util.puts('oauth_token_secret :' + oauth_token_secret)
    util.puts('request token results :' + util.inspect(results))
    util.puts('require user authorize')
    util.puts('go to https://www.plurk.com/OAuth/authorize?oauth_token='+oauth_token)
    helper.ask_cli('Please enter the verification code: ', /[\w\d]+/, function(data) {
      oa.getOAuthAccessToken(oauth_token, oauth_token_secret, data, accessTokenCallback);
    });
  }
};
function accessTokenCallback(error, access_token, access_token_secret, results) {
  util.puts('oauth_access_token :' + access_token)
  util.puts('oauth_token_secret :' + access_token_secret)
  client.set('plurk_oauth_token', access_token, redis.print)
  client.set('plurk_oauth_token_secret', access_token_secret, redis.print)
  oauth_access_token = access_token;
  oauth_access_token_secret = access_token_secret;
  isAuthorized = true;
  util.puts('accesstoken results :' + util.inspect(results))
  util.puts('Requesting access token')
}
exports.callAPI = callAPI;
