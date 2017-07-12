const express = require('express');
const router = express.Router();
var _ = require('lodash');
var removeDiacritics = require('./diacritics');
var Twit = require('twit');

/* o ideal aqui eh colocar na tela a lista das APIs disponiveis nesse modulo */
router.get('/', (req, res) => {
  res.send('General Endpoint - It is working! It is a Christmas miracle!');
});

//recebe o nome da empresa
router.get('/empresa/:texto', (req, res) => {
  //texto que serah analisado
  var empresa = req.params.texto;

  /* pesquisa o termo/empresa no Twitter */
  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    app_only_auth: true
  });

  T.get('search/tweets', {
    q: empresa + ' since:2017-01-01 lang:pt',
    count: 50
  }, function (err, data, response) {
    //ts = array de tweets
    var ts = [];
    //itera sobre o resultado da pesquisa    
    for (var item of data.statuses) {
      //console.log("item: " + item.text);
      //limpa tweet
      var tweet = removeDiacritics(item.text.replace("RT ", "").replace("RT: ", "").replace(/\bhttp\S+|@\S+/ig, "").replace(/\n/g, " ").trim());
      ts.push(tweet);
    }

    var resumo = _.join(_.uniq(ts), '. ');

    console.log(resumo.length);
    
    /* trata o resultado e monta um texto para enviar pro NLU */
    var nlu;
    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    nlu = new NaturalLanguageUnderstandingV1({
      'username': process.env.NLU_USER,
      'password': process.env.NLU_PASS,
      'version_date': '2017-02-27'
    });

    var parameters = {
      'text': resumo,
      'features': {
        'sentiment': {
          'targets': [empresa, 'cognitiva', 'senior']
        },
        'keywords': {
          'sentiment': true,
          'limit': 2
        }
      } ,
      'language': 'pt'
    }

    nlu.analyze(parameters, function (err, resp) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(resp);
      //console.log(JSON.stringify(resp, null, 2));
    });

  });

});

module.exports = router;
