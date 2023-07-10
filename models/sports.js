module.exports = (sequelize, DataTypes) => {

const Sport = sequelize.define('Sport', {
  sportId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  sportName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sportIcon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'sports', // Specify the table name in the database
  timestamps: false, // Disable timestamps (createdAt, updatedAt)
});
return Sport
}