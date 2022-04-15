require('dotenv').config();
const constants = {
	urls: {
		urlStart: "https://eun1.api.riotgames.com",
		summonerByName: "/tft/summoner/v1/summoners/by-name/{name}?api_key={api_key}",
		tftLeague: "/tft/league/v1/entries/by-summoner/{summoner_id}?api_key={api_key}"
	},
	api: process.env.API_KEY
}

module.exports = constants;