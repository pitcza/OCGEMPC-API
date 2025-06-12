// config/duplicateCheckConfig.js
module.exports = {
  fieldWeights: {
    first_name: 20,
    last_name: 20,
    birthdate: 20,
    phone_num: 15,
    address: 10,
    middle_name: 5,
    ext_name: 5,  
    dept: 5,
    position: 5,
    salary: 3,
    ee_status: 2,
    years_coop: 2,
    share_amount: 2,
    saving_amount: 1
  },
  
  thresholds: {
    exactMatch: 100,
    strongSimilarity: 90,
    possibleSimilarity: 80
  }
};