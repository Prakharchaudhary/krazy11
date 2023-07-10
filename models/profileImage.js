

module.exports = (sequelize, DataTypes) => {

    const UserImage = sequelize.define('userImage', {
      Image_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
     
    },{
        tableName: 'userImage',
        timestamps:false
    }
    );
    return UserImage
    
    }
    