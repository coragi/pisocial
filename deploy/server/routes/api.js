const express = require('express');
const router = express.Router();
var _ = require('lodash');
var removeDiacritics = require('./diacritics');
var Twit = require('twit');

var persona = {
  abertura: 0,
  escrupulosidade: 0,
  extroversao: 0,
  amabilidade: 0,
  faixa_emocional: 0,
  n_desafio: 0,
  n_curiosidade: 0,
  v_mudancas: 0,
  v_autocrescimento: 0,
  qtde: 0
};

router.get('/', (req, res) => {
  res.send('General Endpoint - It is working! It is a Christmas miracle!');
});

router.get('/dashboard', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(persona);
});

router.get('/reset', (req, res) => {
  persona.abertura = 0;
  persona.escrupulosidade = 0;
  persona.extroversao = 0;
  persona.amabilidade = 0;
  persona.faixa_emocional = 0;
  persona.n_desafio = 0;
  persona.n_curiosidade = 0;
  persona.v_mudancas = 0;
  persona.v_autocrescimento = 0;
  persona.qtde = 0;

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(0);
});

router.get('/usuario/:texto', (req, res) => {
  var usuario = req.params.texto;

  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    app_only_auth: true
  });

  T.get('statuses/user_timeline', {
    screen_name: usuario,
    count: 100
  }, function (err, data, response) {

    var tweets = [];

    for (var k = 0; k < data.length; k++) {
      var tweet = removeDiacritics(data[k].text.replace("RT ", "").replace("RT: ", "").replace(/\bhttp\S+|@\S+/ig, "").replace(/\n/g, " ").trim());
      tweets.push(tweet);
    }

    var resumo = _.join(_.uniq(tweets), '. ');

    const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
    const personalityInsights = new PersonalityInsightsV3({
      username: '010aef55-de37-47fe-95b2-404176fb35b2',
      password: 'ABkR6MBjEeen',
      version_date: '2016-10-19',
    });

    var params = {
      text: resumo,
      consumption_preferences: true,
      raw_scores: true,
      headers: {
        'accept-language': 'pt-br',
        'accept': 'application/json'
      }
    };

    personalityInsights.profile(params, function (error, response) {
      if (error) {
        console.log('Error:', error);
      } else {
        persona.qtde += 1;

        persona.abertura += response.personality[0].percentile / persona.qtde;
        persona.escrupulosidade += response.personality[1].percentile / persona.qtde;
        persona.extroversao += response.personality[2].percentile / persona.qtde;
        persona.amabilidade += response.personality[3].percentile / persona.qtde;
        persona.faixa_emocional += response.personality[4].percentile / persona.qtde;
        persona.n_desafio += response.needs[0].percentile / persona.qtde;
        persona.n_curiosidade += response.needs[2].percentile / persona.qtde;
        persona.v_mudancas += response.values[1].percentile / persona.qtde;
        persona.v_autocrescimento += response.values[3].percentile / persona.qtde;

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);
      }
    });
  });

});

module.exports = router;
