
module.exports = (sequelize, DataTypes) => {


const PlayerTeam = sequelize.define('UserTeam', {
    UserTeam_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    players: {
      type: DataTypes.JSON,
      allowNull: false
    },
    contestDetailId:{
    type: DataTypes.INTEGER,
    allowNull: false
    }
  },{
    tableName: 'UserTeam',
    timestamps:false
}
  );
  return PlayerTeam

}
  
