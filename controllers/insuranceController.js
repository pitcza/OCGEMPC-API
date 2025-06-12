// Loan Insurance CRUD Controller
const {
  loan_applications,
  loan_insurances,
  makers
} = require('../models');

const dayjs = require('dayjs');

const createInsurance = async (req, res) => {
  try {
    const loan = await loan_applications.findByPk(req.body.loan_id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const certificate_no = `CERT-${loan.id}`;
    const full_name = `${loan.first_name} ${loan.middle_name ?? ''} ${loan.last_name}`.trim();
    const effective_date = dayjs().format('YYYY-MM-DD');
    const expiry_date = dayjs().add(loan.loan_term, 'month').format('YYYY-MM-DD');
    const sum_insured = parseFloat(loan.applied_amount);
    const monthly_premium = (sum_insured / 1000) * 1.041667;
    const gross_premium = monthly_premium * loan.loan_term;

    const insurance = await loan_insurances.create({
      loan_id: loan.id,
      certificate_no,
      full_name,
      age: loan.age,
      status: 'active',
      effective_date,
      expiry_date,
      term: loan.loan_term,
      sum_insured,
      gross_premium
    });

    res.status(201).json(insurance);
  } catch (error) {
    res.status(500).json({ message: 'Error creating insurance record', error });
  }
};

const getAllInsurances = async (req, res) => {
  try {
    const records = await loan_insurances.findAll({
      include: {
        model: makers,
        as: 'maker',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch insurance records', error: err });
  }
};


const getInsuranceById = async (req, res) => {
  try {
    const record = await loan_insurances.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve record', error: err });
  }
};

const updateInsurance = async (req, res) => {
  const userId  = req.user.id;
  try {
    const record = await loan_insurances.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.update(req.body);
    await staff_logs.create({ user_id: userId, action: 'update insurance'});
    res.status(200).json({message: 'Insurance updated successfully', record});
  } catch (err) {
    res.status(500).json({ message: 'Failed to update insurance record', error: err });
  }
};

const deleteInsurance = async (req, res) => {
  try {
    const record = await loan_insurances.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.destroy();
    res.status(204).send({message: 'Insurance record deleted successfully'});
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete record', error: err });
  }
};

module.exports = {
  createInsurance,
  getAllInsurances,
  getInsuranceById,
  updateInsurance,
  deleteInsurance
};
