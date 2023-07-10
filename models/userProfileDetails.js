module.exports = (sequelize, DataTypes) => {

    const UserProfileDetail = sequelize.define('UserProfileDetail', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        // unique: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true

      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
                // unique: true

      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      houseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },otp: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_numberVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      tableName: 'UserProfileDetail',
      timestamps: false
    },);
  
    return UserProfileDetail;
  }
  