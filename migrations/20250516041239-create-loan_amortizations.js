'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('loan_amortizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loan_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'loan_applications', 
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
      },
      maker_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'makers', 
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      installment_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      principal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      interest: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_payment: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      remaining_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('fully paid', 'partially paid', 'unpaid'),
        allowNull: false,
        defaultValue: 'unpaid'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
      
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('loan_amortizations');
  }
};
