const express = require('express');
const request = require('request');
const app = express();
const config = require('../../config');

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.set('keyLastFetched', 0);
app.set('key', '');

const authenticate = _ => {
	let now = new Date().getTime();

	return new Promise((resolve, reject) => {
		if (now - app.get('keyLastFetched') >= 1788000) {
			let uri = config.community_url + '/restapi/vc/authentication/sessions/login'
					+ '?restapi.response_format=json'
					+ '&user.login=' + config.admin_username
					+ '&user.password=' + config.admin_password;
			request(uri, (err, res, body) => {
				app.set('key', JSON.parse(body)['response']['value']['$']);
				app.set('keyLastFetched', now);
				console.log('Fetched new key');
				resolve(true);
			});
		} else {
			resolve(true);
		}
	});
};

app.get('/search', (req, res) => {
	authenticate().then(_ => {
		let uri = config.community_url + '/restapi/vc/users/email/'
				+ req.query.email
				+ '?restapi.response_format=json'
				+ '&restapi.session_key='
				+ app.get('key');
		request({uri: uri, json: true}, (err, response, body) => {
			res.json(body);
		});
	});
});

app.listen(7003);
