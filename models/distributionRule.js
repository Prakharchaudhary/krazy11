module.exports = (sequelize, DataTypes) => {
  const DistributionRule = sequelize.define('DistributionRule', {
    distributionRuleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contestDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rankFrom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rankTo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'DistributionRule',
    timestamps: false
  });

  return DistributionRule;
};
