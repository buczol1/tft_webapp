const express = require('express');
const urls = require('./const').urls;
const apiKey = require('./const').api;
const fetch = require('node-fetch');
const Datastore = require('nedb');
const status = require('./check_status');

//database initialization
db = new Datastore('database.db');
db.loadDatabase();


//webapp initialization
const app = express();
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));


app.get('/summoner/:summName', async (request, response) => {
	const summNameValue = request.params.summName;
	db.find({name: summNameValue}, async (err, docs) => {
		//if summoner is not in database
		if(Object.keys(docs).length === 0){
			//load from riot api
			const api_url = urls.urlStart + urls.summonerByName.replace('{name}',summNameValue).replace('{api_key}',apiKey);
			const fetch_repsonse = await fetch(api_url);
			const json = await fetch_repsonse.json();
			if(status(fetch_repsonse) === 200){
				response.json({statusCode: status(fetch_repsonse),json});
				db.insert(json);	
			}
			else{
				response.json({statusCode: status(fetch_repsonse)});
			}
		}
		else{
			//load from database
			response.json({statusCode: 200, json: docs[0]});
		}		
	});
});

app.get('/tft-info/:summID', async (request, response) => {
	const summID = request.params.summID;
	const api_url = urls.urlStart + urls.tftLeague.replace('{summoner_id}',summID).replace('{api_key}',apiKey);
	const fetch_repsonse = await fetch(api_url);
	const json = await fetch_repsonse.json();
	if(status(fetch_repsonse) === 200){
		response.json({statusCode: status(fetch_repsonse),json});
		db.insert(json[0]);		
	}
	else{
		response.json({statusCode: status(fetch_repsonse)});
	}
});

