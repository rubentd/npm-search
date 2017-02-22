var request = require('request');
var express = require('express');
var apicache = require('apicache');
var cheerio = require('cheerio');
var app = express();

var cache = apicache.middleware;
app.use(cache());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  if(req.query.q){

    search(req.query.q).then( function(results){
      res.send(results);
    });

  }else{
    res.send('Please specify a search string. e.g. q=jquery');
  }
});

// GET apicache index (for the curious)
app.get('/api/cache/index', function(req, res, next) {
  res.send(apicache.getIndex());
});

// GET apicache index (for the curious)
app.get('/api/cache/clear/', function(req, res, next) {
  res.send(200, ApiCache.clear());
});

app.listen(process.env.PORT || 8080)


function search(q){

  return new Promise(function(resolve, reject) {

    request('https://www.npmjs.com/search?q=' + q, function (error, response, body) {

      if(error){
        reject(error);
      }else {
        resolve(parseResults(body));
      }
    });

  });
}

function parseResults(body){
  var results = [];

  $ = cheerio.load(body);
  $('li.package-details').each(function(){
    var name = $(this).find('.packageName').text();
    var author = $(this).find('.authorName').text();
    var description = $(this).find('.description').text();
    var version = $(this).find('.version').text();
    results.push({
      name: name,
      author: author,
      description: description,
      version: version
    });
  });

  return results;
}
