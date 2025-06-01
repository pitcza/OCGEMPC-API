'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaffLog extends Model {
    static associate(models) {
      StaffLog.belongsTo(models.users, {
        foreignKey: 'user_id',
      });
    }
  }

  StaffLog.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:'users',
        key:'id'
      }
    },
    action: {
      type: DataTypes.ENUM(
        'login', 'logout', 'create loan', 'approve loan', 'decline loan', 'deleted loan', 'updated loan'),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
    sequelize,
    modelName: 'staff_logs',
  });

  return StaffLog;
};
