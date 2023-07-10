
module.exports = (sequelize, DataTypes) => {

const KYC = sequelize.define('KycStatus', {
    kyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },{
    tableName: 'KycStatus',
    timestamps:false
  });
  return KYC
}