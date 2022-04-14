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
document.getElementById('submit').addEventListener('click', async() => { 
	let summNameValue = document.getElementById('mood').value;
	const api_url = `summoner/${summNameValue}`;
	const response = await fetch(api_url);
	if(response.status === 200){
		if(root.style.display == 'none')
			root.style.display = 'block';
		const summoner = await response.json();
		console.log(summoner);
		summid.textContent = `Summoner ID: ${summoner.id}`;
		summName.textContent = `Summoner name: ${summoner.name}`;
		summLvl.textContent = `LVL: ${summoner.summonerLevel}`;				
	}

});		
document.getElementById('tft-submit').addEventListener('click', async() => { 
	const summonerID = summid.textContent.replace('Summoner ID: ','');
	const api_url = `tft-info/${summonerID}`;
	const response = await fetch(api_url);
	if(response.status === 200){
		if(tftInfo.style.display == 'none')
			tftInfo.style.display = 'block';
		const tftInfoJson = await response.json();
		console.log(tftInfoJson);
		tftTier.textContent = `Tier: ${tftInfoJson.tier}`;
		tftRank.textContent = `Rank: ${tftInfoJson.rank}`;
		tftLp.textContent = `LP: ${tftInfoJson.leaguePoints}`;
		let wr = (tftInfoJson.wins/tftInfoJson.losses)*100;
		tftWR.textContent = `Top 1: ${wr}%`;
		tftWins.textContent = `Top 1: ${tftInfoJson.wins}`;
		tftLosses.textContent = `Losses: ${tftInfoJson.losses}`;
		tftTotal.textContent = `Total: ${tftInfoJson.wins + tftInfoJson.losses}`;
		tftHS.textContent = tftInfoJson.hotStreak? "Hotstreak: Tak": "Hotstreak: Nie";
	}
	/*const summID = document.getElementById('summID').textContent;
	const api_url = `https://eun1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summID}?api_key=RGAPI-ab83542a-5a21-4216-af45-def1238bfa56`;
	const response = await fetch(api_url);
	if(response.status == 200){
		const tftInfo = await response.json();
		document.getElementById('tft-info').textContent = tftInfo;
	}*/
});	