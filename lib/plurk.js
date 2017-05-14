var plurk_oauth = require ('./plurk_oauth');
var util = require('util');
var api_root_uri = 'https://www.plurk.com';
var api_call = '/APP/Profile/getOwnProfile';
var my_args = process.argv.slice(2);
var params = '';
if (my_args.length > 0) {
  api_call = my_args[0];
  if (my_args.length > 1) {
    params = my_args[1];
  }
}

var dumpData = function(error, data, res) {
  util.puts(data);
}

plurk_oauth.callAPI(api_root_uri + 
  api_call,
  JSON.parse(params),
  dumpData
);
