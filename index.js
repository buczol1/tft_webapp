const express = require('express');
const urls = require('./const').urls;
const apiCode = require('./const').api;
const fetch = require('node-fetch');


const app = express();
app.listen(3000, () => console.log('listening on port 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));


app.get('/summoner/:summName', async (request, response) => {
	const summNameValue = request.params.summName;
	const api_url = urls.urlStart + urls.summonerByName.replace('{name}',summNameValue).replace('{api_key}',apiCode);
	const fetch_repsonse = await fetch(api_url);
	const json = await fetch_repsonse.json();
	response.json(json);
});

app.get('/tft-info/:summID', async (request, response) => {
	const summID = request.params.summID;
	const api_url = urls.urlStart + urls.tftLeague.replace('{summoner_id}',summID).replace('{api_key}',apiCode);
	const fetch_repsonse = await fetch(api_url);
	const json = await fetch_repsonse.json();
	console.log(json);
	response.json(json[0]);
});

