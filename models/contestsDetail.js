module.exports = (sequelize, DataTypes) => {


const Contest = sequelize.define('contestDetail', {
  contestDetailId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  contest_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contestName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entryFee: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  prizePool: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalSpots: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  spotsLeft: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  winningPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
},{
    tableName: 'contestDetail',
    timestamps: false
  });

return Contest;
}
