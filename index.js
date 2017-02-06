var request = require('request');
var express = require('express');
var cheerio = require('cheerio');
var app = express();

app.get('/', function (req, res) {
  if(req.query.q){

    search(req.query.q).then( function(results){
      res.send(results);
    });

  }else{
    res.send('Please specify a search string. e.g. q=react');
  }
})

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
    var name = $(this).find('.name').text();
    var author = $(this).find('.author').text();
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
