require('dotenv').config();
const constants = {
	urls: {
		urlStart: "https://{region}.api.riotgames.com",
		summonerByName: "/tft/summoner/v1/summoners/by-name/{name}?api_key={api_key}",
		tftLeague: "/tft/league/v1/entries/by-summoner/{summoner_id}?api_key={api_key}",
		summonerById: "/tft/summoner/v1/summoners/{summoner_id}?api_key={api_key}"
	},
	regions: {
		reg1: "br1",
		reg2: "eun1",
		reg3: "euw1",
		reg4: "jp1",
		reg5: "kr",
		reg6: "la1",
		reg7: "la2",
		reg8: "na1",
		reg9: "oc1",
		reg10: "tr1",
		reg11: "ru"
	},
	api: process.env.API_KEY
}

module.exports = constants;