module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
      wallet_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      deposit: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      winning: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      bonus: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
    }, {
      tableName: 'wallet', // Specify the table name in the database
      timestamps: false, // Disable timestamps (createdAt, updatedAt)
    });
  
    return Wallet;
  };
  