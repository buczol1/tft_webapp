const express = require('express');
const urls = require('./const').urls;
const apiKey = require('./const').api;
const regions = require('./const').regions;
const fetch = require('node-fetch');
const Datastore = require('nedb');
const status = require('./functions').checkStatus;
const functions = require('./functions');
let region;

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
app.get('/summoner/:summNameAndRegion', async (request, response) => {
	const nameAndRegion = request.params.summNameAndRegion.split(',');
	const summNameValue = nameAndRegion[0];
	const region = regions[nameAndRegion[1]];
	db.find({name: summNameValue}, async (err, docs) => {
		//if summoner is not in database
		if(Object.keys(docs).length === 0){
			//load from riot api
			const api_url = urls.urlStart.replace('{region}',region) + urls.summonerByName.replace('{name}',summNameValue).replace('{api_key}',apiKey);
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
app.get(`/summoner-update/:summIDAndRegion`, async (request, response) => {
	const summIDAndRegion = request.params.summIDAndRegion.split(',');
	const summID = summIDAndRegion[0];
	const region = regions[summIDAndRegion[1]];
	const api_url = urls.urlStart.replace('{region}',region) + urls.summonerById.replace('{summoner_id}',summID).replace('{api_key}',apiKey);
	const fetch_repsonse = await fetch(api_url);
	const body = await fetch_repsonse.json();
	if(status(fetch_repsonse) === 200){
		db.find({id: summID},(err,docs)=>{
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
app.get('/tft-info/:summIDAndRegion', async (request, response) => {
	const summIDAndRegion = request.params.summIDAndRegion.split(',');
	const summID = summIDAndRegion[0];
	const region = regions[summIDAndRegion[1]];
	db.find({summonerId : summID, queueType: 'RANKED_TFT'}, async (err,docs) => {
		//if info is not in db
		if(Object.keys(docs).length === 0){
			const api_url = urls.urlStart.replace('{region}',region) + urls.tftLeague.replace('{summoner_id}',summID).replace('{api_key}',apiKey);
			const fetch_repsonse = await fetch(api_url);
			const body = await fetch_repsonse.json();
			if(status(fetch_repsonse) === 200){
				console.log('200: got from riot api');
				response.json({statusCode: status(fetch_repsonse),body});
				db.insert(body[0]);		
			}
			else{
				response.json({statusCode: status(fetch_repsonse)});
			}
		}
		else{
			console.log("200: got from db");
			response.json({statusCode: 200, body: docs});
		}
	});

});

