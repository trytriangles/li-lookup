const express = require('express');
const request = require('request');
const app = express();
const config = require('../../config');

app.set('keyLastFetched', 0);
app.set('key', '');

let authURI = config.community_url + '/restapi/vc/authentication/sessions/login'
							+ '?restapi.response_format=json'
							+ '&user.login=' + config.admin_username
							+ '&user.password=' + config.admin_password;

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	// Refresh our session key if it's nonexistent or over 29.5 minutes old.
	let now = new Date().getTime();
	if (now - app.get('keyLastFetched') >= 1788000) {
			request(authURI, (err, res, body) => {
				app.set('key', JSON.parse(body)['response']['value']['$']);
				app.set('keyLastFetched', now);
				console.log('Fetched new key');
				next();
			})
	} else {
		next();
	}

});

app.get('/search', (req, res) => {
	let uri = config.community_url + '/restapi/vc/users/email/'
					+ req.query.email
					+ '?restapi.response_format=json'
					+ '&restapi.session_key='
					+ app.get('key');
	request({uri: uri, json: true}, (err, response, body) => res.json(body));
});

app.listen(7003);
