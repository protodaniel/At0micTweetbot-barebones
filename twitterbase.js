/**
 * Created by at0mic on 3/29/14.
 */
var sys = require('util');

/* setup twitter streaming lib */
var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: 'yourconsumerkey',
    consumer_secret: 'yourconsumersecret',
    access_token_key: 'youraccesstokenkey',
    access_token_secret: 'youraccesstokensecret'});

var thekeyword;
thekeyword = ['cats'];

watchTwitter = function() {
//    twit.stream('statuses/filter', {track:['#at0micnews','love']}, function(stream) {
    twit.stream('statuses/filter', {track:thekeyword}, function(stream) {
        stream.on('data', function (data) {
            parseTweet(data);
//            console.log(data)
        });
        stream.on('end', function (response) {
            console.log('disconnected  ');
            end();
        });
        stream.on('destroy', function (response) {
            console.log('disconnected  ');
            end();
            // Handle a 'silent' disconnection from Twitter, no end/error event fired
        });
    });
};

watchTwitter();

var sanitizer = require('sanitizer');
var counter_love = 0;
var counter_hate = 0;

var parseTweet = function(data){

    if(data.lang === 'en' || true){
        var cleanTweet = mysql_real_escape_string(sanitizer.sanitize(data.text));
        var cleanName = mysql_real_escape_string(sanitizer.sanitize(data.user.name));

        var tablename = 'tweetsaboutnews';

        var keyWordMatchesTweet = false;
        for (var i = 0; i < thekeyword.length; i++) {
            if(cleanTweet.indexOf(thekeyword[i]) > -1){
                keyWordMatchesTweet = true;
                break;
            }
        }

        if(keyWordMatchesTweet){
            //TODO authorization to insert in remote database or switch to heroku's postgresql


            var headline = data.text;
            var abstract = 'Sent from ' + (data.user.location ? 'location: ' + data.user.location : (data.user.time_zone ? ' timezone: ' + data.user.time_zone : 'somewhere on planet Earth'));
            var author   = data.user.name;
            var profileImage = data.user.profile_image_url;
            //var image    = data.entities.media.;

            var message = {
                'event'    : 'tweet',
                'author'   : author,
                'headline' : headline,
                'abstract' : abstract,
                'profileImageURL': profileImage,
                'image'    : data.entities.media ? data.entities.media[0].media_url : null
            }

            console.log(message);
        }
    }


};


function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
            // and double/single quotes
        }
    });
}