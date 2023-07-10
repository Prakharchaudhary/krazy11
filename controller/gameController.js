var db = require('../models/index')
var kycStatus = db.kycStatus
var Sport = db.sports
var Match = db.matches
var contestsName = db.contestsName
var ContestDetail = db.contestsDetail
var distributionRule = db.distributionRule
var players = db.players





const axios = require('axios');


const postPlayer = async (req, res) => {
  const matchId = req.params.matchID;
  try {
    // Fetch team IDs from the matches table based on matchId
    const match = await Match.findOne({
      where: { matchId: matchId },
      attributes: ['team1_id', 'team2_id','Realmatch_id'],
      raw: true
    });

    if (!match) {
      console.error(`Match with ID ${matchId} not found.`);
      return;
    }

    const team1Id = match.team1_id;
    const team2Id = match.team2_id;
    const Realmatch_id = match.Realmatch_id

    const team1Url = `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/35878/team/${9}`;
    const team2Url = `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/35878/team/${9}`;

    const headers = {
      'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com',
      'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672'
    };

    const team1Response = await axios.get(team1Url, { headers });
    const team2Response = await axios.get(team2Url, { headers });

    const team1PlayerList = team1Response.data.players?.['playing XI'] || [];
    const team2PlayerList = team2Response.data.players?.['playing XI'] || [];

    const team1PlayerData = team1PlayerList.map(player => {
      return {
        Realmatch_id:Realmatch_id,
        name: player.name,
        team: player.teamName,
        team_id: player.teamId,
        role: player.role,
        creditPoints: player.creditPoints,
        imageUrl: player.faceImageId,
        LastMatchesPlayed: player.matchesPlayed,
        runsScored: player.runsScored,
        wicketsTaken: player.wicketsTaken,
        catchesTaken: player.catchesTaken,
        strikeRate: player.strikeRate,
        economyRate: player.economyRate,
        matchId: matchId,
        substitute: player.substitute,
        ActualPlayer_id: player.id,
        captain: player.captain
        
      };
    });

    const team2PlayerData = team2PlayerList.map(player => {
      return {
        name: player.name,
        team: player.teamName,
        team_id: player.teamId,
        role: player.role,
        creditPoints: player.creditPoints,
        imageUrl: player.faceImageId,
        LastMatchesPlayed: player.matchesPlayed,
        runsScored: player.runsScored,
        wicketsTaken: player.wicketsTaken,
        catchesTaken: player.catchesTaken,
        strikeRate: player.strikeRate,
        economyRate: player.economyRate,
        matchId: matchId,
        substitute: player.substitute,
        player_id: player.id,
        captain: player.captain
      };
    });

    // Save the players to the database
    const savePlayers = async (playerData) => {
      for (const player of playerData) {
        try {
          await players.create(player);
        } catch (error) {
          console.error('Error saving player:', error);
        }
      }
    };

    await savePlayers(team1PlayerData);
    await savePlayers(team2PlayerData);

    console.log('Team 1 Player Data:', team1PlayerData);
    console.log('Team 2 Player Data:', team2PlayerData);

    // Send playerData as the response to the client (Postman)
    res.json({
      team1PlayerData,
      team2PlayerData
    });
  } catch (error) {
    console.error('Error fetching player data:', error);
  }
};



const getAllPlayersByRole = async (req, res) => {
    const matchId = req.params.matchID;
  
    try {
      // Fetch all players from the database based on matchId
      const playerData = await players.findAll({
        where: {
          matchId: matchId
        },
        raw: true
      });
  
      // Organize players into separate arrays based on their roles
      const playersByRole = {
        batsman: [],
        bowler: [],
        allRounder: [],
        wicketKeeper: []
      };
  
      playerData.forEach(player => {
        switch (player.role) {
          case 'Batsman':
            playersByRole.batsman.push(player);
            break;
          case 'Bowler':
            playersByRole.bowler.push(player);
            break;
          case 'Bowling Allrounder':
            playersByRole.allRounder.push(player);
            break;
            case 'Batting Allrounder':
            playersByRole.allRounder.push(player);
            break;
          case 'WK-Batsman':
            playersByRole.wicketKeeper.push(player);
            break;
          default:
            break;
        }
      });
  
      // Send playersByRole as the response to the client (Postman)
      res.json({
        playersByRole
      });
    } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({
        error: 'An error occurred while fetching players'
      });
    }
  };
  


module.exports = {
    postPlayer,  getAllPlayersByRole
};
