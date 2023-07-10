const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('Krazy11', 'root', 'cprakhar999@gmail.com', {
  host: 'localhost',
  logging:false,
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  const db = {}
  db.Sequelize=Sequelize
  db.sequelize = sequelize

  db.userProfileDetails = require('./userProfileDetails')(sequelize,DataTypes)
  db.userReferCode = require('./userReferCode')(sequelize,DataTypes)
  db.profileImage = require('./profileImage')(sequelize,DataTypes)
  db.kycStatus = require('./kycStatus')(sequelize,DataTypes)
  db.KYC = require('./KYC')(sequelize,DataTypes)
  db.sports = require('./sports')(sequelize,DataTypes)
  db.matches = require('./matches')(sequelize,DataTypes)
  db.contestsName = require('./contestsName')(sequelize,DataTypes)
  db.contestsDetail = require('./contestsDetail')(sequelize,DataTypes)
  db.wallet = require('./wallet')(sequelize,DataTypes)
  db.distributionRule = require('./distributionRule')(sequelize,DataTypes)
  db.players = require('./players')(sequelize,DataTypes)
  db.userTeam = require('./userTeam')(sequelize,DataTypes)













// RELATION
  db.userProfileDetails.hasMany(  db.userReferCode, { foreignKey: 'id' });
  db.userReferCode.belongsTo( db.userProfileDetails, { foreignKey: 'id' });

  
  db.userProfileDetails.hasMany(  db.profileImage, { foreignKey: 'id' });
  db.profileImage.belongsTo( db.userProfileDetails, { foreignKey: 'id' });


  db.userProfileDetails.hasMany(  db.KYC, { foreignKey: 'id' });
  db.KYC.belongsTo( db.userProfileDetails, { foreignKey: 'id' });

  db.sports.hasMany(  db.matches, { foreignKey: 'sportId' });
  db.matches.belongsTo( db.sports, { foreignKey: 'sportId' });

  db.matches.hasMany(  db.contestsName, { foreignKey: 'matchId' });
  db.contestsName.belongsTo( db.matches, { foreignKey: 'matchId' });

  db.contestsName.hasMany(  db.contestsDetail, { foreignKey: 'contest_id' });
  db.contestsDetail.belongsTo( db.contestsName, { foreignKey: 'contest_id' });

  db.userProfileDetails.hasMany(  db.wallet, { foreignKey: 'id' });
  db.wallet.belongsTo( db.userProfileDetails, { foreignKey: 'id' });

db.matches.hasMany(db.distributionRule, { foreignKey: 'matchId' });
db.distributionRule.belongsTo(db.matches, { foreignKey: 'matchId' });

  db.contestsDetail.hasMany(db.distributionRule, { foreignKey: 'contestDetailId' });
  db.distributionRule.belongsTo(db.contestsDetail, { foreignKey: 'contestDetailId' });

  db.matches.hasMany(db.players, { foreignKey: 'matchId' });
  db.players.belongsTo(db.matches, { foreignKey: 'matchId' });

  db.userProfileDetails.hasMany(db.userTeam, { foreignKey: 'id' });
  db.userTeam.belongsTo(db.userProfileDetails, { foreignKey: 'id' });

  db.userProfileDetails.hasMany(db.userTeam, { foreignKey: 'id' });
  db.userTeam.belongsTo(db.userProfileDetails, { foreignKey: 'id' });

  db.contestsDetail.hasMany(db.userTeam, { foreignKey: 'contestDetailId' });
  db.userTeam.belongsTo(db.contestsDetail, { foreignKey: 'contestDetailId' });

  sequelize.sync({force:false})
  module.exports = db