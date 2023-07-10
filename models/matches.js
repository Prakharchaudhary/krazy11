// module.exports = (sequelize, DataTypes) => {
//     const Match = sequelize.define(
//       'Match',
//       {
//         matchId: {
//           type: DataTypes.INTEGER,
//           primaryKey: true,
//           autoIncrement: true,
//           allowNull: false,
//         },
//         sportId: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//         },
//         matchDate: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         matchTime: {
//           type: DataTypes.TIME,
//           allowNull: false,
//         },
//         team1: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         team1ImageURL: {
//           type: DataTypes.STRING, // New field to store team 1 image URL
//           allowNull: false,
//         },
//         team2: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         team2ImageURL: {
//           type: DataTypes.STRING, // New field to store team 2 image URL
//           allowNull: false,
//         },
//         venue: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         seriesName: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         stadium: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//       },
//       {
//         tableName: 'matches', // Specify the table name in the database
//         timestamps: false, // Disable timestamps (createdAt, updatedAt)
//       }
//     );
  
//     return Match;
//   };





module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define(
    'Match',
    {
      matchId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      matchDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      matchTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      team1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      team1ImageURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      team2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      team2ImageURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      venue: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seriesName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stadium: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      team1_id: {
        type: DataTypes.INTEGER, // Assuming team1_id is an integer
        allowNull: false,
      },
      team2_id: {
        type: DataTypes.INTEGER, // Assuming team2_id is an integer
        allowNull: false,
      },
      Realmatch_id: {
        type: DataTypes.INTEGER, // Assuming Realmatch_id is an integer
        allowNull: false,
      },
    },
    {
      tableName: 'matches',
      timestamps: false,
    }
  );

  return Match;
};
