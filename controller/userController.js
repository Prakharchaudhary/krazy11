var db = require('../models/index')
var UserProfileDetail = db.userProfileDetails
var userReferCode = db.userReferCode
var userImage = db.profileImage
var KYC = db.KYC
var Sport = db.sports
var Match = db.matches
var contestsName = db.contestsName
var Wallet = db.wallet
var ContestDetail = db.contestsDetail
var DistributionRule = db.distributionRule
var userTeam = db.userTeam















const { Op } = require('sequelize');
const axios = require('axios');



const bcrypt = require('bcrypt');

const sendMail = require('../helper/sendMail')
const randomstring = require('randomstring');

const jwt = require('jsonwebtoken')
const contestsDetail = require('../models/contestsDetail')
const {JWT_SECRET} = process.env

const generateToken = (id) => {
    try {
      const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '50h' });
      return token;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate token');
    }
  };
const saltRounds = 10; 
 
  

const addUser = async (req, res) => {
    const email = req.body.email;
    UserProfileDetail.findOne({ where: { email } })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use. Please choose a different email.' });
        }
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(404).json({ message: 'Error creating user.' });
          }
  
          const usernamePrefix = email.split('@')[0].substring(0, 4);
          const usernameSuffix = Math.floor(100000 + Math.random() * 900000).toString().substring(0, 6);
          const username = usernamePrefix + usernameSuffix;
  
          const verificationToken = randomstring.generate();
          let mailSubject = 'mail verification';
          let content = '<p>hii ' + username + ', please <a href = "http://localhost:6000/mail-verification?token=' + verificationToken + '">verify </a>your mail ';
  
          sendMail(req.body.email, mailSubject, content)
            .then(() => {
              UserProfileDetail.create({
                email: req.body.email,
                password: hashedPassword,
                username,
                token: verificationToken,
              })
                .then(async (student_data) => {
                  const referCode = randomstring.generate({
                    length: 6,
                    charset: 'alphanumeric',
                    capitalization: 'uppercase',
                  });
  
                  await userReferCode.create({
                    refer_code: referCode,
                    id: student_data.id,
                  });
  
                  const authToken = generateToken(student_data.id);
                  console.log('New user created:', student_data.toJSON());
                  student_data.update({ authToken: authToken });
                  res.status(201).json({ message: 'User created successfully. Please check your email for verification.', student_data });
                })
                .catch((error) => {
                  console.error('Error creating user:', error);
                  res.status(500).json({ message: 'Error creating user.' });
                });
            })
            .catch((error) => {
              console.error('Error sending email:', error);
              res.status(500).json({ message: 'Error sending email.' });
            });
        }); // Closing parenthesis for bcrypt.hash callback
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error finding user.' });
      });
  };
  




  const verifyEmail = (req, res) => {
    const token = req.query.token;
    UserProfileDetail.findOne({ where: { token: token } })
      .then((UserProfileDetail) => {
        if (!UserProfileDetail) {
          return res.status(400).json({ message: 'Invalid verification token.' });
        }
  
        UserProfileDetail.update({ isEmailVerified: true, token: null })
          .then(() => {
            console.log('user verified:', UserProfileDetail.toJSON());
            res.status(200).json({ message: 'Email verification successful. You can now log in.' });
          })
          .catch((error) => {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user.' });
          });
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error finding user.' });
      });
  };

  const otpGenerator = require('otp-generator');

  const apiKey = 'Tu1jcZ2MGqODd9azxgoQsnfK0k78VytYFUHBJ6L3wrbiNEIlhRN5JRXg42H7ImxbLsKjvwEaOS0rWhlQ';
  




  async function sendOTP(req, res) {
    try {
      const { phoneNumber, email, password } = req.body;
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      console.log('Generated OTP:', otpCode);
  
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save the OTP entry in the database
      await UserProfileDetail.create({
        phoneNumber: phoneNumber,
        otp: otpCode,
        email: email,
        password: hashedPassword
      });
  
      // Format the phone number with the country code
      const formattedPhoneNumber = phoneNumber;
  
      const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
        params: {
          authorization: apiKey,  
          route: 'otp',
          variables_values: otpCode.toString(), // Convert the OTP code to a string
          numbers: formattedPhoneNumber,
          flash: '0'
        }
      });
  
      console.log('OTP sent:', response.data);
  
      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error sending OTP:', error.response.data);
        res.status(500).json({ error: 'Failed to send OTP' });
      } else {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
      }
    }
  }
  
  
  
  
  
  
  
  async function verifyOTP(req, res) {
    try {
      const { id } = req.params;
      const {otp }= req.body
  
      // Find the OTP entry in the database
      const otpEntry = await UserProfileDetail.findOne({
        where: {
          id: id,
          OTP: otp
        }
      });
  
      if (!otpEntry) {
        res.status(400).json({ error: 'Invalid OTP' });
        return;
      }
  
      // Update the verification status
      otpEntry.is_numberVerified = true;
      otpEntry.otp = null; // Clear the OTP value
      await otpEntry.save();
  
      res.json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  }


  const updateUser = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const { username,mobile, dob, houseNumber, street, city, pincode, state, country } = req.body;
  
      const user = await UserProfileDetail.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      if (!user.isEmailVerified) {
        return res.status(400).json({ message: 'Please verify your email before updating your profile.' });
      }
  
      if (username) {
        user.username = username;
      }

      if (dob) {
        user.dob = dob;
      }
  
      if (houseNumber) {
        user.houseNumber = houseNumber;
      }
  
      if (street) {
        user.street = street;
      }
  
      if (city) {
        user.city = city;
      }
  
      if (pincode) {
        user.pincode = pincode;
      }
  
      if (state) {
        user.state = state;
      }
  
      if (country) {
        user.country = country;
      }
  
      if (mobile) {
        user.mobile = mobile;
      }
  
      await user.save();
      res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user.' });
    }
  };
  

  const logoutUser = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Delete the user's token from the database
      const user = await UserProfileDetail.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Set the token field to null or empty in the database
      user.authToken = null; // Change this according to your data model
  
      // Save the updated user record
      await user.save();
  
      res.status(200).json({ message: 'User logged out successfully.' });
    } catch (error) {
      console.error('Error logging out user:', error);
      res.status(500).json({ message: 'Error logging out user.' });
    }
  };


 
  
  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await UserProfileDetail.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if the user's phoneNumber is verified
      if (!user.is_numberVerified) {
        return res.status(401).json({ message: 'Phone number is not verified. Please verify your phone number first.' });
      }
  
      // Check if the provided password matches the user's password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
  
      // Generate a new token for the user
      const token = generateToken(user.id); // Change this according to your token generation logic
  
      // Update the user's token in the database
      user.token = token; // Change this according to your data model
  
      // Save the updated user record
      await user.save();
  
      res.status(200).json({ message: 'User logged in successfully.', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Error logging in user.' });
    }
  };
  


  const uploadProfileImage = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const user = await UserProfileDetail.findByPk(userId);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file provided.' });
      }
  
      const imageUrl = req.file.filename;
      console.log(imageUrl);
  
      const image = await userImage.create({
        image: imageUrl,
        id: userId,
      });
  
      res.status(200).json({ message: 'Profile image uploaded successfully.', imageUrl });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ message: 'Error uploading profile image.' });
    }
  };
  

  const changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      // Retrieve the user ID from the authorization token
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Find the user by ID
      const user = await UserProfileDetail.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Compare the current password provided with the stored password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
  
      // Generate a new hashed password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Error changing password.' });
    }
  };
  
  
  const kycComplete = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
  
    let adhar_card_front = null;
    let adhar_card_back = null;
    let pan_card_front = null;
    let pan_card_back = null;
  
    if (req.files.adhar_card_front && req.files.adhar_card_back) {
      adhar_card_front = req.files.adhar_card_front[0].path;
      adhar_card_back = req.files.adhar_card_back[0].path;
    } else if (req.files.pan_card_front && req.files.pan_card_back) {
      pan_card_front = req.files.pan_card_front[0].path;
      pan_card_back = req.files.pan_card_back[0].path;
    } else {
      return res.status(400).json({ error: 'Photos of Aadhar Card or PAN Card are missing' });
    }
  
    const selfie = req.files.selfie[0].path;
    const { adhar_number } = req.body;
  
    try {
      const kyc = await KYC.create({ adhar_card_front, adhar_card_back, pan_card_front, pan_card_back, selfie, adhar_number, id: userId });
      return res.status(201).json(kyc);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server Error' });               
    }
  };
  
  
  const updateKYC = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
  
    const { kycId } = req.params;
  
    let adhar_card_front = null;
    let adhar_card_back = null;
    let pan_card_front = null;
    let pan_card_back = null;
    let selfie = null;
    let adhar_number = null;
  
    // Check which fields are being updated
    if (req.files && req.files.adhar_card_front && req.files.adhar_card_back) {
      adhar_card_front = req.files.adhar_card_front[0].path;
      adhar_card_back = req.files.adhar_card_back[0].path;
    }
  
    if (req.files && req.files.pan_card_front && req.files.pan_card_back) {
      pan_card_front = req.files.pan_card_front[0].path;
      pan_card_back = req.files.pan_card_back[0].path;
    }
  
    if (req.files && req.files.selfie) {
      selfie = req.files.selfie[0].path;
    }
  
    if (req.body && req.body.adhar_number) {
      adhar_number = req.body.adhar_number;
    }
  
    try {
      const kyc = await KYC.findOne({ where: { KYC_id: kycId, id: userId } });
  
      if (!kyc) {
        return res.status(404).json({ error: 'KYC not found' });
      }
  
      // Update the KYC document
      kyc.adhar_card_front = adhar_card_front || kyc.adhar_card_front;
      kyc.adhar_card_back = adhar_card_back || kyc.adhar_card_back;
      kyc.pan_card_front = pan_card_front || kyc.pan_card_front;
      kyc.pan_card_back = pan_card_back || kyc.pan_card_back;
      kyc.selfie = selfie || kyc.selfie;
      kyc.adhar_number = adhar_number || kyc.adhar_number;
  
      await kyc.save();
  
      return res.status(200).json(kyc);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server Error' });
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
  
  const getMatchBysportsID = async (req, res) => {
    try {
     const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
      const user = await UserProfileDetail.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      
      const sportId = req.params.sportId; // Assuming the sport ID is passed as a query parameter
  
      const liveMatches = await  Match.findAll({where:{sportId:sportId}});
      res.json({ data: liveMatches });
    } catch (error) {
      console.error('Error fetching upcoming matches', error);
      res.status(500).json({ error: 'Error fetching live matches' });
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


  const postWallet = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await UserProfileDetail.findByPk(userId);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      const { deposit, winning, bonus,total_balance } = req.body;
      const id = userId
      const wallet = await Wallet.create({ deposit:deposit, winning:winning, bonus:bonus, id:id ,total_balance:total_balance });
  
      res.status(201).json({ data: wallet });
    } catch (error) {
      console.error('Error creating wallet entry:', error);
      res.status(500).json({ error: 'Error creating wallet entry' });
    }
  };
  
  const getWallet = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await UserProfileDetail.findByPk(userId);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Find wallet details based on player ID
      const wallet = await Wallet.findOne({ where: { id :userId} });
  
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
  
      res.status(200).json({ data: wallet });
    } catch (error) {
      console.error('Error retrieving wallet:', error);
      res.status(500).json({ error: 'Error retrieving wallet' });
    }
  };
  


const getContestPrizes = async (req, res) => {
  try {
    const { contestDetailId } = req.params;

    // Find the contest by its ID
    const contest = await ContestDetail.findByPk(contestDetailId);
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    // Find all distribution rules associated with the contest
    const distributionRules = await DistributionRule.findAll({
      where: {
        contestDetailId: contestDetailId
      },
      order: [['rankFrom', 'ASC']]
    });

    if (distributionRules.length === 0) {
      return res.status(404).json({ error: 'No distribution rules found for the contest' });
    }

    // Calculate the total prize pool for the contest
    // const totalPrizePool = contest.entryFees * contest.totalParticipants;
    const totalPrizePool =contest.prizePool
    // Calculate the winning amounts for each rank
    const winningAmounts = distributionRules.map(rule => {
      const { rankFrom, rankTo, percentage } = rule;

      // Calculate the winning amount based on the rank range and percentage
      const rankPrize = (percentage / 100) * totalPrizePool;

      // Format the rank and winning amount for display
      const rank = rankTo ? `${rankFrom}-${rankTo}` : rankFrom.toString();
      return { rank, prize: rankPrize };
    });

    // Send the response with the winning amounts and total prize pool
    res.status(200).json({ data: { winningAmounts, totalPrizePool } });
  } catch (error) {
    console.error('Error retrieving contest prizes:', error);
    res.status(500).json({ error: 'Error retrieving contest prizes' });
  }
};



const checkEntryAndBalance = async (req, res) => {
  const contestId = req.params.contestId;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  try {
    // Check if the contest has entry fees
    const contest = await ContestDetail.findOne({
      where: { contest_id: contestId },
      attributes: ['entryFee'],
      raw: true
    });

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    const entryFee = contest.entryFee;

    // Check user's account balance
    const userWallet = await Wallet.findOne({
      where: { id: userId },
      attributes: ['total_balance'],
      order: [['wallet_id', 'DESC']], // Sort by id in descending order
      raw: true
    });

    if (!userWallet) {
      return res.status(404).json({ error: 'User wallet not found' });
    }

    const userBalance = userWallet.total_balance;
    console.log(userBalance);

    if (userBalance < entryFee) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Proceed with entering the game
    // Deduct the entry fee from the user's account balance
    const updatedBalance = userBalance - entryFee;
    console.log(updatedBalance);
    await Wallet.update({ total_balance: updatedBalance }, { where: { id: userId } });

    return res.json({ message: 'Entered the game successfully' });

  } catch (error) {
    console.error('Error checking entry and balance:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};






const createTeamByUsers = async (req, res) => {
  const contestDetailId = req.params.contestDetailId;
  console.log(contestDetailId);
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const { players, captainId, viceCaptainId } = req.body; // Include captainId and viceCaptainId in the request body

  try {
    const contestDetail = await ContestDetail.findByPk(contestDetailId);
    if (!contestDetail) {
      return res.status(404).json({ error: 'Contest detail not found' });
    }

    if (!players || players.length !== 11) {
      return res.status(400).json({ error: 'Please select exactly 11 players' });
    }

    const uniquePlayers = [...new Set(players)];
    if (uniquePlayers.length !== 11) {
      return res.status(400).json({ error: 'Duplicate player selections are not allowed' });
    }

    let totalCreditPoints = 0;
    players.forEach((player) => {
      totalCreditPoints += player.creditPoints;
    });

    if (totalCreditPoints > 100) {
      return res.status(400).json({ error: 'Total credit points exceed the maximum limit of 100' });
    }

    // Update the players array to include captainId and viceCaptainId
    const updatedPlayers = players.map((player) => {
      if (player.playerId === captainId) {
        return { ...player, captainId: true };
      } else if (player.playerId === viceCaptainId) {
        return { ...player, viceCaptainId: true };
      }
      return player;
    });

    const team = await userTeam.create({
      id: userId,
      players: updatedPlayers,
      contestDetailId: contestDetailId,
    });

    // Decrement the SpotsLeft count for the contestDetailId
    const updatedSpotsLeft = contestDetail.spotsLeft - 1;
    await contestDetail.update({ spotsLeft: updatedSpotsLeft });

    console.log(`SpotsLeft decremented for contestDetailId: ${contestDetailId}`);

    res.json({ message: 'Team created successfully', teamId: team.id });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getTeamById = async (req, res) => {
  const teamId = req.params.UserTeam_id;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  console.log(teamId);

  try {
    const team = await userTeam.findOne({
      where: {
        UserTeam_id: teamId,
        id: userId
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    const captain = team.players.find((player) => player.captainId);
    const viceCaptain = team.players.find((player) => player.viceCaptainId);

    console.log('Captain:', captain);
    console.log('Vice-Captain:', viceCaptain);

    res.json({ team });
  } catch (error) {
    console.error('Error retrieving team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateTeamById = async (req, res) => {
  const teamId = req.params.UserTeam_id;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const { players } = req.body;

  try {
    // Find the team in the database by its ID and owner's user ID
    const team = await userTeam.findOne({
      where: {
        UserTeam_id: teamId,
        id: userId
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
   

    // Perform validations on the selected players
    if (!players || players.length !== 11) {
      return res.status(400).json({ error: 'Please select exactly 11 players' });
    }

    const uniquePlayers = [...new Set(players)];
    if (uniquePlayers.length !== 11) {
      return res.status(400).json({ error: 'Duplicate player selections are not allowed' });
    }

    let totalCreditPoints = 0;
    players.forEach(player => {
      totalCreditPoints += player.creditPoints;
    });

    if (totalCreditPoints > 100) {
      return res.status(400).json({ error: 'Total credit points exceed the maximum limit of 100' });
    }

    // Update the team with the new player selection
    await team.update({ players: players });

    res.json({ message: 'Team updated successfully' });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




  module.exports = {
    addUser,verifyEmail , updateUser,logoutUser , loginUser , uploadProfileImage , changePassword ,
     kycComplete ,updateKYC ,getSportsByID ,getSports,getMatchBysportsID,getContestNamebyiD,getContestName,postWallet,getWallet
     ,getContestInformationFromcontentName,getContestinformation,getContestPrizes,checkEntryAndBalance,createTeamByUsers,getTeamById,updateTeamById
     ,sendOTP,verifyOTP
    }
