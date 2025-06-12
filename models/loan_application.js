'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LoanApplication extends Model {
    static associate(models) {
        LoanApplication.belongsToMany(models.comakers,{
            foreignKey: 'loan_id',
            through: models.loan_comakers
        });

        LoanApplication.belongsTo(models.makers, {
            foreignKey: "maker_id",
        });
        LoanApplication.hasMany(models.loan_amortizations, {
          foreignKey: 'loan_id'
        });
        LoanApplication.hasOne(models.loan_insurances, {
          foreignKey: 'loan_id'
        });
    }
  }

  LoanApplication.init({
    // Applicant's Information
     maker_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'makers', 
        key: 'id'
      }
    },
    loan_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applied_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    loan_term: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loan_purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repayment_freq: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loan_status: {
        type: DataTypes.ENUM('pending', 'approved', 'declined', 'completed', 'overdue'),
        allowNull: false,
        defaultValue: 'pending'  
    },
    status_details: {
      type: DataTypes.STRING,
      allowNull: true
    },
    supporting_documents: {
      type: DataTypes.JSON,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'loan_applications',
    timestamps: true,
  });

  return LoanApplication;
};
