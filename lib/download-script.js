var request = require('request')
  , fs = require('fs')
  , async = require('async')
  , sanitize = require('./sanitize')
  , cache = {}
  , EventEmitter = require('events').EventEmitter;

var vent = exports.vent = new EventEmitter();

exports.FLAG_DEBUG = false;

var extract_data = function (text) {
  var n = null;
  try {
    n = text.match(/(?:<p[^>]*class="[^"]*(?:[^js\-]tweet\-text)[^"]*"[^>]*>)(.*)(?:<\/p>)/);
    if (!n) {
      return null;
    }

    return n[1];
  } catch (msg) {
    return null;
  }
};

var load_text = function (user_id, tweet_id, cb) {
  var req_url = "http://twitter.com/" + user_id + "/status/" + tweet_id;

  if (cache[tweet_id]) {
    return cb(null, cache[tweet_id]);
  }

  request({ uri: req_url }, function(error, response, body){
    if(!error && response.statusCode == 200) {
      var tweet = extract_data(body);

      if (tweet == null || tweet.length < 1) {
        return cb('Not Found', null);
      }

      var tweet_text = sanitize.sanitize(tweet);
      cache[tweet_id] = tweet_text;
      return cb(null, tweet_text);
    }

    return cb('Not Found', null);
  });
};

var read_file = exports.read = function (filename, cb) {
  cb = cb || function () {};
  var i = 0;
  var complete = [];
  fs.readFile(filename, 'utf8', function (err, data) {
    var lines = data.toString().split('\n');
    var total = lines.length - 1;

    vent.emit('progress:init', total);

    var iter = function (e, done) {
      if (e.length < 1) {
        vent.emit('progress:tick');
        return done();
      }

      var fields = e.toString().trim().split('\t');
      var tweet_id = fields[0];
      var user_id = fields[1];

      load_text(user_id, tweet_id, function (err, text) {
        if (err) {
          vent.emit('progress:tick');
          return done();
        }

        fields.push(text);
        complete.push(fields);

        var percentage = (((i++)/total) * 100).toFixed(2);
        exports.FLAG_DEBUG && console.info(percentage + "% Fetched: ", fields, "\n-------");
        vent.emit('progress:tick');
        done();
      });
    };

    async.eachLimit(lines, 5, iter, function () {
      cb(complete);
    });

  });
};