var Twit = require('twit');
var _ = require('lodash');

var T = new Twit({
  consumer_key: 'Ax66YuKM1QLCGR6EcN1MsBTWL',
  consumer_secret: '9lHrY3UUdMx5196yMSDElDnhDIgf0lmiJu1vxZV0T9XMXqcxHt',
  app_only_auth: true
});

var s = [];

T.get('search/tweets', {
  q: '"ibm watson" since:2017-06-01',
  count: 5
}, function (err, data, response) {
  //console.log(data.statuses[0]);
  for (var item of data.statuses) {
    //console.log("item: " + item.text);
    //console.log("clean: " + item.text.replace("RT ", "").replace("RT: ", "").replace(/\bhttp\S+|@\S+/ig, "").replace(/\n/g," ").trim());
    var t = item.text.replace("RT ", "").replace("RT: ", "").replace(/\bhttp\S+|@\S+/ig, "").trim();
    s.push(t);
  }

  //console.log(s);

  var saida = _.join(s, '. ');

  console.log(saida);
});
