'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('loan_applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
       maker_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'makers', 
        key: 'id'
      }
    },
      loan_type: {
      type: Sequelize.STRING,
      allowNull: false,
      },
      applied_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      loan_term: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      loan_purpose: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      repayment_freq: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      loan_status: {
          type: Sequelize.ENUM('pending', 'approved', 'declined', 'completed', 'overdue'),
          allowNull: false,
          defaultValue: 'pending'  
      },
      status_details: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      supporting_documents: {
      type: Sequelize.JSON,
      allowNull: false
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
     await queryInterface.dropTable('loan_applications');
  }
};
