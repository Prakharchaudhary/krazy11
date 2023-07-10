

module.exports = (sequelize, DataTypes) => {

const ContestName = sequelize.define('ContestName', {

    contest_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    contestName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    matchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
    
  },{
    tableName: 'ContestName',
    timestamps: false
  });
  return ContestName
}