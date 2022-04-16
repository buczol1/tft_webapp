const root = document.getElementById('info');
const summName = document.getElementById('summName');
const summid = document.getElementById('summID');
const summLvl = document.getElementById('lvl');
const tftInfo = document.getElementById('tft-info');

const tftTier = document.getElementById('tier');
const tftRank = document.getElementById('rank');
const tftLp = document.getElementById('lp');
const tftWins = document.getElementById('wins');
const tftLosses = document.getElementById('losses');
const tftTotal = document.getElementById('total');
const tftHS = document.getElementById('hotStreak');
const tftWR = document.getElementById('top-1');

//Get info about summoner from server
document.getElementById('submit').addEventListener('click', async() => { 
	if(tftInfo.style.display == 'block')
		tftInfo.style.display = 'none';
	let summNameValue = document.getElementById('mood').value;
	const api_url = `summoner/${summNameValue}`;
	const response = await fetch(api_url);
	const responseBody = await response.json();
	const status = responseBody.statusCode;
	const summoner = responseBody.body;
	if(status === 200){
		if(root.style.display == 'none')
			root.style.display = 'block';
		summid.textContent = `Summoner ID: ${summoner.id}`;
		summName.textContent = `Summoner name: ${summoner.name}`;
		summLvl.textContent = `LVL: ${summoner.summonerLevel}`;	
	}
	else{
		console.log(status);
	}
});	

//Get tft info about summoner from server
document.getElementById('tft-submit').addEventListener('click', async() => { 
	const summonerID = summid.textContent.replace('Summoner ID: ','');
	const api_url = `tft-info/${summonerID}`;
	const response = await fetch(api_url);
	const responseBody = await response.json();
	const status = responseBody.statusCode;
	const tftInfoJson = responseBody.body[0];

	if(status === 200){
		if(tftInfoJson == null){
			const p = document.createElement('p');
			p.textContent = "This player did not played any tft ranked!";
			root.append(p);
		}
		else{
			if(tftInfo.style.display == 'none')
				tftInfo.style.display = 'block';
			tftTier.textContent = `Tier: ${tftInfoJson.tier}`;
			tftRank.textContent = `Rank: ${tftInfoJson.rank}`;
			tftLp.textContent = `LP: ${tftInfoJson.leaguePoints}`;
			let wr = (tftInfoJson.wins/tftInfoJson.losses)*100;
			tftWR.textContent = `Top 1: ${wr}%`;
			tftWins.textContent = `Top 1: ${tftInfoJson.wins}`;
			tftLosses.textContent = `Losses: ${tftInfoJson.losses}`;
			tftTotal.textContent = `Total: ${tftInfoJson.wins + tftInfoJson.losses}`;
			tftHS.textContent = tftInfoJson.hotStreak? "Hotstreak: true": "Hotstreak: false";
		}		
	}
	else{
		console.log(status);
	}
});	

//Uptade info about summoner from riotapi
document.getElementById("info-update").addEventListener("click", async () => {
	const summonerID = summid.textContent.replace('Summoner ID: ','');
	const api_url = `summoner-update/${summonerID}`;
	const respons = await fetch(api_url);
	const responseBody = await respons.json();
	const status = responseBody.statusCode;
	const summoner = responseBody.body;
	if(status === 200){
		summid.textContent = `Summoner ID: ${summoner.id}`;
		summName.textContent = `Summoner name: ${summoner.name}`;
		summLvl.textContent = `LVL: ${summoner.summonerLevel}`;
	}
	else{
		console.log(status);
	}
});