module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define('players', {
    matchId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    Realmatch_id: {
    type: DataTypes.INTEGER, // Assuming Realmatch_id is an integer
     allowNull: false,
      },
    name: {
    type: DataTypes.STRING,
    allowNull: false
    },
    ActualPlayer_id:{
    type: DataTypes.INTEGER,
    allowNull: false
    },
    team: {
    type: DataTypes.STRING,
    allowNull: false
    },
    team_id: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    role: {
    type: DataTypes.STRING,
    allowNull: false
    },
    creditPoints: {
    type: DataTypes.FLOAT,
    allowNull: true
    },
    imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
    },
    LastMatchesPlayed: {
    type: DataTypes.INTEGER,
    allowNull: true
    },
    runsScored: {
    type: DataTypes.INTEGER,
    allowNull: true
    },
    wicketsTaken: {
    type: DataTypes.INTEGER,
    allowNull: true
    },
    catchesTaken: {
    type: DataTypes.INTEGER,
    allowNull: true
    },
    strikeRate: {
    type: DataTypes.FLOAT,
    allowNull: true
    },
    economyRate: {
    type: DataTypes.FLOAT,
    allowNull: true
    },
    captain: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
    },
    substitute: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
    }
    });
    
    return Player;
    };