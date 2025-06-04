'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LoanAmortization extends Model {
    static associate(models) {
      LoanAmortization.belongsTo(models.loan_applications, {
        foreignKey: 'loan_id'
      });

      LoanAmortization.belongsTo(models.makers, {
        foreignKey: "maker_id"
      })
    }
  }

  LoanAmortization.init({
    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'loan_applications', 
        key: 'id'
      }
    },
    maker_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'makers', 
        key: 'id'
      }
    },
    installment_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    principal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    interest: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_payment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    remaining_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('fully paid', 'partially paid', 'unpaid'),
      allowNull: false,
      defaultValue: 'unpaid'
    }
  }, {
    sequelize,
    modelName: 'loan_amortizations',
    timestamps: true
  });

  return LoanAmortization;
};
