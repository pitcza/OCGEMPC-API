'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('required_documents', {
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
    payslip: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     valid_id: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     company_id: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     proof_of_billing: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     employment_details: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
     barangay_clearance: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
     await queryInterface.dropTable('required_documents');
  }
};
