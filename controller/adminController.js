var db = require('../models/index')
var kycStatus = db.kycStatus
var Sport = db.sports
var Match = db.matches
var contestsName = db.contestsName
var ContestDetail = db.contestsDetail
var distributionRule = db.distributionRule





const axios = require('axios');


const KYCStatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      // Create a new KYC entry in the database
      const kyc = await kycStatus.create({
        status: status,
      });
  
      // Return the newly created KYC entry
      res.status(201).json(kyc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  const UpdateKYCStatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      // Update the status of all KYC entries
      const result = await kycStatus.update(
        { status: status },
        { where: {} }
      );
  
      // Return the number of rows updated
      res.status(200).json({ updatedRows: result[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  const addSports = async (req, res) => {
    try {
      // Retrieve the sport details from the request body
      const { sportName } = req.body;
      sportIcon = req.file.filename
  
      // Create a new sport in the database
      const newSport = await Sport.create({
        sportName,
        sportIcon,
      });
  
      // Send a success response with the created sport object
      res.status(201).json({ message: 'Sport created successfully', sport: newSport });
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error('Error creating sport:', error);
      res.status(500).json({ message: 'Error creating sport' });
    }
  };

  const getSports = async (req, res) => {
    try {
      const sports = await Sport.findAll();
      res.status(200).json({ sports });
    } catch (error) {
      console.error('Error retrieving sports:', error);
      res.status(500).json({ message: 'Error retrieving sports' });
    }
  };
  const getSportsByID = async (req, res) => {
    try {
      const { sportId } = req.params;
      const sport = await Sport.findByPk(sportId);
      if (!sport) {
        return res.status(404).json({ message: 'Sport not found' });
      }
      res.status(200).json({ sport });
    } catch (error) {
      console.error('Error retrieving sport:', error);
      res.status(500).json({ message: 'Error retrieving sport' });
    }
  };

  const updateSports = async (req, res) => {
    try {
      const { sportId } = req.params;
      const { sportName } = req.body;
      const sportIcon = req.file.filename

      const sport = await Sport.findByPk(sportId);
      if (!sport) {
        return res.status(404).json({ message: 'Sport not found' });
      }
      sport.sportName = sportName;
      sport.sportIcon = sportIcon;
      await sport.save();
      res.status(200).json({ message: 'Sport updated successfully', sport });
    } catch (error) {
      console.error('Error updating sport:', error);
      res.status(500).json({ message: 'Error updating sport' });
    }
  };
  
  const deleteSports = async (req, res) => {
    try {
      const { sportId } = req.params;
      const sport = await Sport.findByPk(sportId);
      if (!sport) {
        return res.status(404).json({ message: 'Sport not found' });
      }
      await sport.destroy();
      res.status(200).json({ message: 'Sport deleted successfully' });
    } catch (error) {
      console.error('Error deleting sport:', error);
      res.status(500).json({ message: 'Error deleting sport' });
    }
  };


const saveUpcomingMatches = async (req,res) => {
    const options = {
      method: 'GET',
      url: 'https://cricbuzz-cricket.p.rapidapi.com/schedule/v1/international',
      headers: {
        'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672',
        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
      }
    };
  
    try {
      const response = await axios.request(options);
      const matchScheduleMap = response.data.matchScheduleMap;
  
      const liveMatches = []; // Array to store the live matches

  
      for (const schedule of matchScheduleMap) {
        if (schedule.scheduleAdWrapper) {
          const matchScheduleList = schedule.scheduleAdWrapper.matchScheduleList;
          const date = schedule.scheduleAdWrapper.date;
  
          for (const matchInfo of matchScheduleList) {
            const matches = matchInfo.matchInfo;
            const seriesName = matchInfo.seriesName;
            const seriesCategory = matchInfo.seriesCategory;
            const seriesId = matchInfo.seriesId;
            const seriesHomeCountry = matchInfo.seriesHomeCountry;
            
            
  
            for (const match of matches) {
              const matchId = match.matchId;
              const matchDesc = match.matchDesc;
              const matchFormat = match.matchFormat;
              const startDate = new Date(parseInt(match.startDate));
              const endDate = new Date(parseInt(match.endDate));
              const team1 = match.team1.teamSName || '';
              const team2 = match.team2.teamSName || '';
              const venueInfoground = match.venueInfo.ground || '';
              const venueInfocity = match.venueInfo.city || '';
              const team1ImageId = match.team1.imageId; // Image ID of team 1
              const team2ImageId = match.team2.imageId; // Image ID of team 2
              const team1ImageURL = `https://cricbuzz-cricket.p.rapidapi.com/photos/v1/${team1ImageId}`;
              const team2ImageURL = `https://cricbuzz-cricket.p.rapidapi.com/photos/v1/${team2ImageId}`;

              const team1_id = match.team1.teamId;
              const team2_id = match.team2.teamId;
              const Realmatch_id = match.seriesId;
        
          
              console.log(team1ImageURL);
              console.log(team2ImageURL);

            const matchDate = startDate.toISOString().split('T')[0]; // Extracting date in 'YYYY-MM-DD' format
            const matchTime = startDate.toISOString().split('T')[1].slice(0, 8); // Extracting time in 'HH:mm:ss' format
            console.log(matchTime  );
            console.log(matchDate);

              const liveMatch = new Match({
                sportId: 1,
                matchDate: matchDate,
                matchTime : matchTime,
                team1: team1,
                team1ImageURL: team1ImageURL,
                team2: team2,
                team2ImageURL: team2ImageURL,
                venue: venueInfocity,
                seriesName: seriesName,
                stadium: venueInfoground,
                team1_id: team1_id,
                team2_id: team2_id,
                Realmatch_id: Realmatch_id
              });
  
              // Save the live match to the database
              await liveMatch.save().catch((error) => {
                console.error('Error saving live match to the database:', error);
              });
    
              liveMatches.push(liveMatch);  
            }
          }
        }
      }

      console.log('Live matches fetched successfully.');
  
      return liveMatches;
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error; // Rethrow the error to handle it in the caller function
    }
  };
  

  // Example usage:
  const fetchAndSaveupcomingMatches = async (req,res) => {
    try {
      if (!res || !res.send) {
        throw new Error('Invalid response object');
      }
      const liveMatches = await saveUpcomingMatches();
    //   console.log('Live matches:', liveMatches);
      // Format the output for Postman
      const formattedOutput = {
        status: 'success',
        message: 'Live matches fetched successfully',
        data: liveMatches
      };

      res.send({data:formattedOutput})
      return formattedOutput;
    } catch (error) {
      console.error('Error saving live matches to the database:', error);
      // Format the error message for Postman
      const errorOutput = {
        status: 'error',
        message: 'Error fetching live matches',
        error: error.message
      };
      return errorOutput;
    }
  };
  
  // // Call the fetchAndSaveupcomingMatches function to fetch and save live matches periodically
  // setInterval(fetchAndSaveupcomingMatches, 5 * 60 * 1000);
  


  const postContestName = async (req,res) => {
    try {
      const { matchId } = req.params;
      const { contestName } = req.body;
  
      const contestDetail = await contestsName.create({ contestName:contestName, matchId:matchId });
  
      res.status(201).json({ data: contestDetail });
    } catch (error) {
      console.error('Error creating contest detail:', error);
      res.status(500).json({ error: 'Error creating contest detail' });
    }
  };



  const updateContestName = async (req,res) => {
    try {
      const { contest_id } = req.params;
      const { contestName } = req.body;
  
      const contestDetail = await contestsName.findByPk(contest_id);
      if (!contestDetail) {
        return res.status(404).json({ error: 'Contest detail not found' });
      }
  
      contestDetail.contestName = contestName;
      await contestDetail.save();
  
      res.json({ data: contestDetail });
    } catch (error) {
      console.error('Error updating contest detail:', error);
      res.status(500).json({ error: 'Error updating contest detail' });
    }
  };

  const deleteContestName = async (req,res) => {
    try {
      const { contest_id } = req.params;
  
      const contestDetail = await contestsName.findByPk(contest_id);
      if (!contestDetail) {
        return res.status(404).json({ error: 'Contest detail not found' });
      }
  
      await contestDetail.destroy();
  
      res.json({ message: 'Contest detail deleted successfully' });
    } catch (error) {
      console.error('Error deleting contest detail:', error);
      res.status(500).json({ error: 'Error deleting contest detail' });
    }
  };


  const getContestName = async (req,res) => {
    try {
      const { matchId } = req.params;
  
      const contestDetails = await contestsName.findAll({ where: { matchId } });
  
      res.json({ data: contestDetails });
    } catch (error) {
      console.error('Error retrieving contest details:', error);
      res.status(500).json({ error: 'Error retrieving contest details' });
    }
  };

  const getContestNamebyiD = async (req,res) => {
    try {
      const { contest_id } = req.params;
  
      const contestDetails = await contestsName.findAll({ where: { contest_id } });
  
      res.json({ data: contestDetails });
    } catch (error) {
      console.error('Error retrieving contest details:', error);
      res.status(500).json({ error: 'Error retrieving contest details' });
    }
  };

  const createContestinformation = async (req, res) => {
    try {
      const { contest_id } = req.params;
      const { entryFee, prizePool, totalSpots, winningPercentage } = req.body;
  
      // Find the contest name based on the contest ID
      const contest = await contestsName.findOne({
        where: { contest_id }
      });
  
      if (!contest) {
        return res.status(400).json({ error: 'Invalid contest ID' });
      }
  
      // Create the new contest
      const newContest = await ContestDetail.create({
        contest_id:contest_id,
        contestName: contest.contestName,
        entryFee,
        prizePool,
        totalSpots,
        spotsLeft: totalSpots,
        winningPercentage
      });
  
      res.status(201).json({ data: newContest });
    } catch (error) {
      console.error('Error creating contest:', error);
      res.status(500).json({ error: 'Error creating contest' });
    }
  };
  const getContestinformation = async (req, res) => {
    try {
      const { contestDetailId } = req.params;
  
      // Find the contest by contest_id
      const contest = await ContestDetail.findOne({
        where: {
            contestDetailId: contestDetailId
        },
        // include: [contestName] // Include the ContestName model to get the contest name
      });
  
      if (!contest) {
        return res.status(404).json({ error: 'Contest detail not found' });
      }
  
      res.json({ data: contest });
    } catch (error) {
      console.error('Error retrieving contest:', error);
      res.status(500).json({ error: 'Error retrieving contest' });
    }
  };


  const getContestInformationFromcontentName = async (req, res) => {
    try {
      const { contestName } = req.params;
  
      // Find the contest by contestName and include ContestName model
      const contest = await ContestDetail.findAll({
        where: { contestName },
        include: [contestsName] // Include the ContestName model to get the contest name
      });
  
      if (!contest) {
        return res.status(404).json({ error: 'Contest not found' });
      }
  
      res.json({ data: contest });
    } catch (error) {
      console.error('Error retrieving contest:', error);
      res.status(500).json({ error: 'Error retrieving contest' });
    }
  };
  
  const updateContestinformation = async (req, res) => {
    try {
      const { contestDetailId } = req.params;
  
      // Find the contest by contest_id
      const contest = await ContestDetail.findOne({
        where: { contestDetailId }
      });
  
      if (!contest) {
        return res.status(404).json({ error: 'Contest not found' });
      }
  
      // Update contest details
      const updatedContest = await contest.update(req.body);
  
      res.json({ data: updatedContest });
    } catch (error) {
      console.error('Error updating contest:', error);
      res.status(500).json({ error: 'Error updating contest' });
    }
  };



  const deleteContestinformation = async (req, res) => {
    try {
      const { contestDetailId } = req.params;
  
      // Find the contest by contest_id
      const contest = await ContestDetail.findOne({
        where: { contestDetailId }
      });
  
      if (!contest) {
        return res.status(404).json({ error: 'Contest not found' });
      }
  
      // Delete the contest
      await contest.destroy();
  
      res.json({ message: 'Contest deleted successfully' });
    } catch (error) {
      console.error('Error deleting contest:', error);
      res.status(500).json({ error: 'Error deleting contest' });
    }
  };



const postDistributionRule = async (req, res) => {
    try {
      const { matchId, contestDetailId, rankFrom, rankTo, percentage } = req.body;
  
      // Check if the matchId exists in the matches table
      const matchExists = await Match.findOne({
        where: { matchId }
      });
      if (!matchExists) {
        return res.status(400).json({ error: 'Invalid matchId' });
      }
  
      // Check if the contestDetailId exists in the contestsDetail table
      const contestDetailExists = await ContestDetail.findOne({
        where: { contestDetailId }
      });
      if (!contestDetailExists) {
        return res.status(400).json({ error: 'Invalid contestDetailId' });
      }
  
      // Create a new distribution rule
      const DistributionRule = await distributionRule.create({
        matchId,
        contestDetailId,
        rankFrom,
        rankTo,
        percentage,
      });
  
      res.status(201).json({ data: DistributionRule });
    } catch (error) {
      console.error('Error creating distribution rule:', error);
      res.status(500).json({ error: 'Error creating distribution rule' });
    }
  };
  const updateDistributionRule = async (req, res) => {
    try {
        const { distributionRuleId } = req.params;

      const {  rankFrom, rankTo, percentage } = req.body;
  
      // Check if the distribution rule exists
      const existingDistributionRule = await distributionRule.findByPk(distributionRuleId);
      if (!existingDistributionRule) {
        return res.status(404).json({ error: 'Distribution rule not found' });
      }
  
      // Update the distribution rule
      await existingDistributionRule.update({
        rankFrom,
        rankTo,
        percentage,
      });
  
      res.status(200).json({ message: 'Distribution rule updated successfully' });
    } catch (error) {
      console.error('Error updating distribution rule:', error);
      res.status(500).json({ error: 'Error updating distribution rule' });
    }
  };



  const getDistributionRule = async (req, res) => {
    try {
      const {  contestDetailId } = req.params;
  
      // Find all distribution rules associated with the given match and contest
      const distributionRules = await distributionRule.findAll({
        where: {
        
          contestDetailId
        }
      });
      
      if (distributionRules.length === 0) {
        return res.status(404).json({ error: 'No distribution rules found for the provided match and contest' });
      }
  
      // Fetch all rank prizes associated with each distribution rule
      const rankPrizes = await distributionRule.findAll({
        where: {
          distributionRuleId: distributionRules.map(rule => rule.contestDetailId)
        }
      });
  
      res.status(200).json({ data: { distributionRules, rankPrizes } });
    } catch (error) {
      console.error('Error retrieving distribution rules:', error);
      res.status(500).json({ error: 'Error retrieving distribution rules' });
    }
  };
  




  const deleteDistributionRule = async (req, res) => {
    try {
      const { distributionRuleId } = req.params;
  
      // Check if the distribution rule exists
      const existingDistributionRule = await distributionRule.findByPk(distributionRuleId);
      if (!existingDistributionRule) {
        return res.status(404).json({ error: 'Distribution rule not found' });
      }
  
      // Delete the distribution rule
      await existingDistributionRule.destroy();
  
      res.status(200).json({ message: 'Distribution rule deleted successfully' });
    } catch (error) {
      console.error('Error deleting distribution rule:', error);
      res.status(500).json({ error: 'Error deleting distribution rule' });
    }
  };


  // const options = {
  //   method: 'GET',
  //   url: 'https://cricbuzz-cricket.p.rapidapi.com/teams/v1/2/players',
  //   headers: {
  //     'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672',
  //     'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
  //   }
  // };

  // const axios = require('axios');

// const options = {
//   method: 'GET',
//   url: 'https://cricbuzz-cricket.p.rapidapi.com/teams/v1/2/players',
//   headers: {
//     'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672',
//     'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
//   }
// };

// axios.request(options)
//   .then(function (response) {
//     const players = response.data;
//     console.log('Response data:', players);

//     // Extract player name, position, and image
//     const playerData = players.map((player) => ({
//       name: player.name,
//       position: player.name === 'BATSMEN' ? 'Batsman' : player.name,
//       image: player.imageId ? `https://example.com/images/${player.imageId}.jpg` : null
//     }));

//     console.log(playerData);
//   })
//   .catch(function (error) {
//     console.error('Error fetching player data:', error);
//   });

// // Fetch player data from external API
// const getPlayerData = async () => {
//   try {
//     const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/teams/v1/2/players'); // Replace with the actual API endpoint

//     const { data } = response;
//     const players = [];

//     // Extract players by position
//     const positions = ['BATSMEN', 'ALL ROUNDER', 'WICKET KEEPER', 'BOWLER'];
//     positions.forEach((position) => {
//       const positionData = data.find((player) => player.name === position);
//       if (positionData) {
//         players.push({
//           position: position,
//           players: positionData,
//         });
//       }
//     });

//     return players;
//   } catch (error) {
//     console.error('Error fetching player data:', error);
//     throw error;
//   }
// };

// // Example usage
// getPlayerData()
//   .then((players) => {
//     console.log('Player data:', players);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

  











// const getPlayerData = async () => {
//   const options = {
//     method: 'GET',
//     url: 'https://cricbuzz-cricket.p.rapidapi.com/teams/v1/2/players',
//     headers: {
//       'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672',
//       'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
//     }
//   };

//   try {
//     const response = await axios.request(options);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// Usage example
// getPlayerData()
//   .then(data => {
//     if (data) {
//       // Separate players into different categories
//       const batsmen = [];
//       const allRounders = [];
//       const wicketKeepers = [];
//       const bowlers = [];

//       data.player.forEach(player => {
//         if (player.name === "BATSMEN") {
//           // Skip category label
//           return;
//         } else if (player.name === "ALL ROUNDER") {
//           allRounders.push(player);
//         } else if (player.name === "WICKET KEEPER") {
//           wicketKeepers.push(player);
//         } else if (player.name === "BOWLER") {
//           bowlers.push(player);
//         } else {
//           batsmen.push(player);
//         }
//       });

//       // Function to print player information
//       const printPlayerInfo = (player) => {
//         console.log("Name:", player.name);
//         console.log("Image ID:", player.imageId);
//         console.log("Batting Style:", player.battingStyle || "Not available");
//         console.log("Bowling Style:", player.bowlingStyle || "Not available");
//         console.log("----------------------");
//       };

//       // Print the players in each category
//       console.log("Batsmen:");
//       batsmen.forEach(printPlayerInfo);

//       console.log("All-Rounders:");
//       allRounders.forEach(printPlayerInfo);

//       console.log("Wicket Keepers:");
//       wicketKeepers.forEach(player => {
//         console.log("Name:", player.name);
//         console.log("Image ID:", player.imageId);
//         console.log("Batting Style:", player.battingStyle || "Not available");
//         console.log("----------------------");
//       });

//       console.log("Bowlers:");
//       bowlers.forEach(printPlayerInfo);
//     }
//   });












// const axios = require('axios');

  const getPlayerData = async () => {
    const options = {
      method: 'GET',
      url: 'https://cricbuzz-cricket.p.rapidapi.com/teams/v1/2/players',
      headers: {
        'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672',
        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Function to print player information
  const printPlayerInfo = (player) => {
    console.log("Name:", player.name);
    console.log("Image ID:", player.imageId);
    console.log("Batting Style:", player.battingStyle || "Not available");
    console.log("Bowling Style:", player.bowlingStyle || "Not available");
    console.log("----------------------");
  };

  // Usage example
  getPlayerData()
    .then(data => {
      if (data) {
        const playerCategories = {};

        // Group players by category
        data.player.forEach(player => {
          if (player.name === "BATSMEN") {
            playerCategories.batsmen = [];
          } else if (player.name === "ALL ROUNDER") {
            playerCategories.allRounders = [];
          } else if (player.name === "WICKET KEEPER") {
            playerCategories.wicketKeepers = [];
          } else if (player.name === "BOWLER") {
            playerCategories.bowlers = [];
          } else {
            // Add players to their respective categories
            if (playerCategories.batsmen) {
              playerCategories.batsmen.push(player);
            } else if (playerCategories.allRounders) {
              playerCategories.allRounders.push(player);
            } else if (playerCategories.wicketKeepers) {
              playerCategories.wicketKeepers.push(player);
            } else if (playerCategories.bowlers) {
              playerCategories.bowlers.push(player);
            }
          }
        });

        // Print the players in each category
        if (playerCategories.batsmen) {
          console.log("Batsmen:");
          playerCategories.batsmen.forEach(printPlayerInfo);
        }

        if (playerCategories.allRounders) {
          console.log("All-Rounders:");
          playerCategories.allRounders.forEach(printPlayerInfo);
        }

        if (playerCategories.wicketKeepers) {
          console.log("Wicket Keepers:");
          playerCategories.wicketKeepers.forEach(player => {
            console.log("Name:", player.name);
            console.log("Image ID:", player.imageId);
            console.log("Batting Style:", player.battingStyle || "Not available");
            console.log("----------------------");
          });
        }

        if (playerCategories.bowlers) {
          console.log("Bowlers:");
          playerCategories.bowlers.forEach(printPlayerInfo);
        }
      }
    });


















  // const getPlayerList = async () => {
  //   const options = {
  //     method: 'GET',
  //     url: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/35878/team/9',
  //     headers: {
  //       'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672',
  //       'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
  //     }
  //   };
  
  //   try {
  //     const response = await axios.request(options);
  //     const playerList = response.data.players['playing XI'] || [];
  //     // console.log(playerList);
  
  //     // Create an object to store players based on their roles
  //     const playersByRole = {
  //       Batsman: [],
  //       WK: [],
  //       Allrounder: [],
  //       // Batting_Allrounder: [],
  //       Bowler: []
  //     };
  
  //     // Distribute players into their respective roles
  //     for (const player of playerList) {
  //       switch (player.role) {
  //         case 'Batsman':
  //           playersByRole.Batsman.push(player);
  //           break;
  //         case 'WK-Batsman':
  //           playersByRole.WK.push(player);
  //           break;
  //         case 'Bowling Allrounder':
  //           playersByRole.Allrounder.push(player);
  //           break;
  //         case 'Batting Allrounder':
  //           playersByRole.Allrounder.push(player);
  //           break;
  //         case 'Bowler':
  //           playersByRole.Bowler.push(player);
  //           break;
  //       }
  //     }
  
  //     // Return the players by role
  //     return playersByRole;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // };
  
  // // Example usage:
  // getPlayerList()
  //   .then((playersByRole) => {
  //     console.log(playersByRole);
  //   })
  //   .catch((error) => {
  //     console.error('Error getting player list:', error);
  //   })

  
    const getPlayerLists = async () => {
      const team1Options = {
        method: 'GET',
        url: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/35878/team/9',
        headers: {
          'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672',
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        }
      };
    
      const team2Options = {
        method: 'GET',
        url: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/35878/team/9',
        headers: {
          'X-RapidAPI-Key': 'dd004d657dmsh32c432b781026adp1cd2a6jsn9994b5245672',
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        }
      };
    
      try {
        // Make API requests to fetch player lists of both teams
        const [team1Response, team2Response] = await Promise.all([
          axios.request(team1Options),
          axios.request(team2Options)
        ]);
    
        const team1PlayerList = team1Response.data.players?.['playing XI'] || [];
        const team2PlayerList = team2Response.data.players?.['playing XI'] || [];
    
        // Create objects to store players based on their roles for both teams
        const team1PlayersByRole = {
          Batsman: [],
          WK: [],
          Allrounder: [],
          Bowler: []
        };
    
        // const team2PlayersByRole = {
        //   Batsman: [],
        //   WK: [],
        //   Allrounder: [],
        //   Bowler: []
        // };
    
        // Distribute players of team 1 into their respective roles
        for (const player of team1PlayerList) {
          switch (player.role) {
            case 'Batsman':
              team1PlayersByRole.Batsman.push(player);
              break;
            case 'WK-Batsman':
              team1PlayersByRole.WK.push(player);
              break;
            case 'Bowling Allrounder':
            case 'Batting Allrounder':
              team1PlayersByRole.Allrounder.push(player);
              break;
            case 'Bowler':
              team1PlayersByRole.Bowler.push(player);
              break;
          }
        }
    
        // Distribute players of team 2 into their respective roles
        for (const player of team2PlayerList) {
          switch (player.role) {
            case 'Batsman':
              team1PlayersByRole.Batsman.push(player);
              break;
            case 'WK-Batsman':
              team1PlayersByRole.WK.push(player);
              break;
            case 'Bowling Allrounder':
            case 'Batting Allrounder':
              team1PlayersByRole.Allrounder.push(player);
              break;
            case 'Bowler':
              team1PlayersByRole.Bowler.push(player);
              break;
          }
        }
    
        // Return the players by role for both teams
        return {
          team1: team1PlayersByRole,
          // team2: team2PlayersByRole
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    
    // Example usage:
    getPlayerLists()
      .then(({ team1, team2 }) => {
        console.log('Team 1 players by role:', team1);
        // console.log('Team 2 players by role:', team2);
  })
  .catch((error) => {
    console.error('Error getting player lists:', error);
  });

    


  module.exports = {
    KYCStatus,UpdateKYCStatus,addSports,getSports,deleteSports,updateSports,getSportsByID,saveUpcomingMatches,
    fetchAndSaveupcomingMatches,postContestName,updateContestName,deleteContestName,getContestName,getContestNamebyiD,createContestinformation,
    getContestinformation,getContestInformationFromcontentName,updateContestinformation,deleteContestinformation,postDistributionRule,
    updateDistributionRule,getDistributionRule, deleteDistributionRule
  }
