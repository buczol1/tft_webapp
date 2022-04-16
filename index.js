const express = require('express');
const urls = require('./const').urls;
const apiKey = require('./const').api;
const fetch = require('node-fetch');
const Datastore = require('nedb');
const status = require('./functions').checkStatus;
const functions = require('./functions');

//database initialization
db = new Datastore('database.db');
db.loadDatabase();


//webapp initialization
const app = express();
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

//get info about summoner
app.get('/summoner/:summName', async (request, response) => {
	if(typeof(request.params.summName) !== 'string')
		const summNameValue = toString(request.params.summName);
	else
				const summNameValue = request.params.summName;
	db.find({name: summNameValue}, async (err, docs) => {
		//if summoner is not in database
		if(Object.keys(docs).length === 0){
			//load from riot api
			const api_url = urls.urlStart + urls.summonerByName.replace('{name}',summNameValue).replace('{api_key}',apiKey);
			const fetch_repsonse = await fetch(api_url);
			const body = await fetch_repsonse.json();
			if(status(fetch_repsonse) === 200){
				console.log('200: got from riot api');
				response.json({statusCode: status(fetch_repsonse),body});
				db.insert(body);	
			}
			else{
				response.json({statusCode: status(fetch_repsonse)});
			}
		}
		else{
			//load from database
			console.log('200: got from db');
			response.json({statusCode: 200, body: docs[0]});
		}		
	});
});

//force update info about summoner
app.get(`/summoner-update/:summID`, async (request, response) => {
	const summID = request.params.summID;
	const api_url = urls.urlStart + urls.summonerById.replace('{summoner_id}',summID).replace('{api_key}',apiKey);
	const fetch_repsonse = await fetch(api_url);
	const body = await fetch_repsonse.json();
	if(status(fetch_repsonse) === 200){
		db.find({id: summID},(err,docs)=>{
			console.log({body,docs});
			if(functions.isContainedIn(body,docs[0])){
				console.log("200: Data has not been changed");
				response.json({statusCode: 200, body});
			} 
			else{
				db.update({id: summID}, { $set: body }, {}, (err, numReplaced) => {
					if(err){
						console.log(err);
						response.json({statusCode: 500});
					}
					else{
						console.log('200: updated successfully, replaced: ' + numReplaced + ' rows');
						response.json({statusCode: 200, body});
					}
				});				
			}
		});

	}
	else{
		response.json({statusCode: status(fetch_repsonse)});
	}
});

//get tft info about summoner
app.get('/tft-info/:summID', async (request, response) => {
	const summID = request.params.summID;
	const api_url = urls.urlStart + urls.tftLeague.replace('{summoner_id}',summID).replace('{api_key}',apiKey);
	const fetch_repsonse = await fetch(api_url);
	const body = await fetch_repsonse.json();
	if(status(fetch_repsonse) === 200){
		response.json({statusCode: status(fetch_repsonse),body});
		db.insert(body[0]);		
	}
	else{
		response.json({statusCode: status(fetch_repsonse)});
	}
});

