var request = require('superagent');

request
    .get('/queryData')
    .end(function(err, res) {
        if (err) {
            console.error(err);
        } else {
            console.log(res.body.text);
        }
    });
