const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes ) => {
    class Makers extends Model {
        static associate(models){
            Makers.hasMany(models.loan_applications, {
                foreignKey: 'maker_id',
            });

            Makers.hasMany(models.loan_amortizations, {
                foreignKey: "maker_id",
            });

            Makers.hasMany(models.loan_insurances, {
              foreignKey: 'maker_id'
            });

            Makers.hasOne(models.required_documents, {
              foreignKey: 'maker_id'
            });
        }
    }

    Makers.init({
      first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ext_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_num: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dept: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    ee_status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    years_coop: {
      type: DataTypes.STRING,
      allowNull: false
    },
    share_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    saving_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
    }, {
    timestamps: true,
    sequelize,
    modelName: 'makers',
    });
    return Makers;
};