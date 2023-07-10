module.exports = (sequelize, DataTypes) => {
  const KYC = sequelize.define('KYC', {
    KYC_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    adhar_card_front: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    adhar_card_back: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    pan_card_front: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    pan_card_back: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    selfie: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    adhar_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  }, {
    tableName: 'KYC',
    timestamps: false
  });

  return KYC;
};
