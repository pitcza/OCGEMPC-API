'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RequiredDocuments extends Model {
    static associate(models) {
        RequiredDocuments.belongsTo(models.makers, {
            foreignKey: "maker_id",
        });
    }
  }

  RequiredDocuments.init({
     maker_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'makers', 
        key: 'id'
      }
    },
    payslip: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     valid_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     company_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     proof_of_billing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     employment_details: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     barangay_clearance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'required_documents',
    timestamps: true,
  });

  return RequiredDocuments;
};
