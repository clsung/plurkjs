var plurk_oauth = require ('./plurk_oauth');
var util = require('util');
var api_root_uri = 'http://www.plurk.com';
var api_call = '/APP/Profile/getOwnProfile';
var my_args = process.argv.slice(2);
if (my_args.length > 0) {
    util.puts(my_args);
    api_call = my_args[0];
}

var dumpData = function(error, data, res) {
  util.puts(data);
}

plurk_oauth.callAPI(api_root_uri + 
  api_call,
  '',
  dumpData
);
