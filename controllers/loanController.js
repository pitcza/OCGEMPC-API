const db = require('../models');
const {
  loan_applications,
  comakers,
  makers,
  loan_amortizations,
  loan_insurances, 
  staff_logs
} = db;
const dayjs = require('dayjs');
const { Op, fn, col, literal } = require('sequelize');

// Dashboard 
const getTotalApplicationsThisMonth =  async (req, res) => {
  try {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const loanCount =  await loan_applications.count({
    where: {
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth]
      }
    }
  });
   res.status(200).json({ message: 'success', loanCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch total loan applications this month', error: err });
  }
};

const getTotalLoanAmountThisMonth = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await loan_applications.findOne({
      attributes: [[fn('SUM', col('applied_amount')), 'total']],
      where: {
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
      raw: true
    });
    const formattedResult = parseFloat(result.total) || 0;

    res.status(200).json({message: 'success', formattedResult});
  } catch (err) {
    res.status(500).json({message: 'Failed to fetch total loan amount this month', error:err})
  }
}

const getTotalActiveLoans = async (req, res) => {
  try{
    const totalActiveLoans = await loan_amortizations.count({
       where: {
        remaining_balance: {
          [Op.ne]: 0
        }
      }
    });

    res.status(200).json({message: 'success', totalActiveLoans});
  } catch (err) {
    res.status(500).json({message: 'Failed to fetch total active loans', error:err})
  }
}

const getTotalPaidLoans = async (req, res) => {
  try {
    const [results] = await db.sequelize.query(`
    SELECT la.id
    FROM loan_applications la
    JOIN loan_amortizations lam ON lam.loan_id = la.id
    GROUP BY la.id
    HAVING SUM(lam.remaining_balance) = 0
  `);

  const totalPaidLoans = results.length;

  res.status(200).json({ message: 'success', totalPaidLoans });
  } catch (error) {
   res.status(500).json({message: 'Failed to fetch total paid loans', error: error})
  }
}

const getApplicationsbyMonth = async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear()
    const result = await loan_applications.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
      [fn('COUNT', col('id')), 'count']
    ],
    where: {
      createdAt: {
        [Op.between]: [
          new Date(year, 0, 1),
          new Date(year, 11, 31, 23, 59, 59, 999)
        ]
      }
    },
    group: [literal('month')],
    order: [[literal('month'), 'ASC']],
    raw: true
  });
    res.status(200).json({ message: 'success', result });
  } catch (error) {
    res.status(500).json({message: 'Failed to fetch loan applications by month', error})
  }
};

const getApplicationsPerStatus = async (req, res) => {
  try {
  const result = await loan_applications.findAll({
      attributes: [
        'loan_status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['loan_status'],
      raw: true
    });
    res.status(200).json({ message: 'success', result });
  } catch (err) {
    res.status(500).json({message: 'Failed to fetch loan applications', error:err})
  }
};

const getMostRecentPayments = async (req, res) => {
  try {
    const mostRecentPayments =  await loan_amortizations.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      raw: true
    });
    res.status(200).json({message: 'success', mostRecentPayments});
  } catch (err) {
    res.status(500).json({message: 'Failed to fetch most recent payments', error: err});
  }
}

// Utility function to calculate amortization schedule
const generateAmortizationSchedule = ({ loanAmount, termMonths, interestRate }) => {
  const monthlyRate = interestRate / 100 / 12;
  const amortization = [];

  const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths));
  let remainingBalance = loanAmount;

  for (let i = 1; i <= termMonths; i++) {
    const interest = remainingBalance * monthlyRate;
    const principal = monthlyPayment - interest;
    remainingBalance -= principal;

    amortization.push({
      installment_no: i,
      due_date: dayjs().add(i, 'month').format('YYYY-MM-DD'),
      principal: principal.toFixed(2),
      interest: interest.toFixed(2),
      total_payment: monthlyPayment.toFixed(2),
      remaining_balance: remainingBalance > 0 ? remainingBalance.toFixed(2) : '0.00'
    });
  }

  return amortization;
};

const generateLoanInsurance = ({loan, transaction}) => {
  const certificate_no = `CERT-${loan.id}`;
  const billing_statement_no = `BILL-${loan.id}`;
  const full_name = `${loan.first_name} ${loan.middle_name ?? ''} ${loan.last_name}`.trim();
  const effective_date = dayjs().format('YYYY-MM-DD');
  const expiry_date = dayjs().add(loan.loan_term, 'month').format('YYYY-MM-DD');
  const sum_insured = parseFloat(loan.applied_amount);
  const monthly_premium = (sum_insured / 1000) * 1.041667;
  const annual_premium = monthly_premium * 12;
  const gross_premium = monthly_premium * loan.loan_term;

  return loan_insurances.create({
    loan_id: loan.id,
    maker_id: loan.maker_id,
    billing_statement_no,
    certificate_no,
    full_name,
    age: loan.age,
    status: 'active',
    effective_date,
    expiry_date,
    term: loan.loan_term,
    sum_insured,
    monthly_premium,
    annual_premium,
    gross_premium
  }, { transaction });
}

// Create Loan
const createLoan = async (req, res) => {
  const userId = req.user.id;
  const transaction = await db.sequelize.transaction();
  try {
    //  Maker Logic -> if existing, fetches by id; else, creates new one
    let maker;
    if (req.body.maker_id) {
      maker = await makers.findByPk(req.body.maker_id, { transaction });
      if (!maker) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Maker not found' });
      }
    } else {
      maker = await makers.create(req.body, { transaction });
    }

    // Comaker logic, employs same logic as maker
    let comaker;
    if (req.body.co_maker_id) {
      comaker = await comakers.findByPk(req.body.co_maker_id, { transaction });
      if (!comaker) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Comaker not found' });
      }
    } else {
      comaker = await comakers.create(req.body.co_maker, { transaction });
    }

    // Loan Creation Logic
    const loanData = { ...req.body, maker_id: maker.id };
    const loan = await loan_applications.create(loanData, { transaction });

    // Assigning loan comaker
    await db.loan_comakers.create({ loan_id: loan.id, comaker_id: comaker.id }, { transaction });

    // callback to generateAmortizationSchedule function, auto generates schedule upon submission
    const amortizationSchedule = generateAmortizationSchedule({
      loanAmount: parseFloat(loan.applied_amount),
      termMonths: loan.loan_term,
      interestRate: 12 // Adjust as needed
    });
    const amortizationRecords = amortizationSchedule.map(item => ({
      loan_id: loan.id,
      ...item
    }));
    await loan_amortizations.bulkCreate(amortizationRecords, { transaction });

    // Populate insurance related data
    const insurance = await generateLoanInsurance({ loan, transaction });

    // Populate required documents values
    // Assume files are sent as booleans
    // If files are present, bool val = true
    // If files are not present, bool val = false
    const docPayload = {
      maker_id: maker.id,
      payslip: !!req.body.payslip,
      valid_id: !!req.body.valid_id,
      company_id: !!req.body.company_id,
      proof_of_billing: !!req.body.proof_of_billing,
      employment_details: !!req.body.employment_details,
      barangay_clearance: !!req.body.barangay_clearance
    };
    await required_documents.create(docPayload, { transaction });

    // Log action
    await staff_logs.create({ user_id: userId, action: 'create loan' }, { transaction });

    await transaction.commit();
    res.status(201).json({
      maker,
      comaker,
      loan,
      amortizationSchedule,
      insurance,
      required_documents: docPayload
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({
      message: 'Loan creation failed',
      error: err.message
    });
  }
};

// Read All Loans
const getAllLoans = async (req, res) => {
  try {
    const loans = await loan_applications.findAll({
     include: [makers, comakers, loan_amortizations, loan_insurances]
    });
    res.status(200).json({message: 'Loans retrieved successfully', loans});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching loans', error: err });
  }
};

// Get One Loan
const getLoanById = async (req, res) => {
  try {
    const loan = await loan_applications.findByPk(req.params.id, {
      include: [makers, comakers, loan_amortizations, loan_insurances]
    });

    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    res.status(200).json({message: 'Loan retrieved successfully', loan});
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving loan', error: err });
  }
};

const getLoanByMakerId = async (req, res) => {
  const userId = req.params.id;
  try {
    if(!userId) return res.status(400).json({ message: 'User ID is required' });
    const loan = await loan_applications.findAll({
      where: {
        maker_id: userId
      },
      include: [makers, comakers, loan_amortizations, loan_insurances],
      order: [['createdAt', 'DESC']], 
    });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.status(200).json({message: `Loan retrieved successfully`, loan});
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving loans', error: err });
  }
}

// Update Loan
const updateLoan = async (req, res) => {
  const userId  = req.user.id;
  try {
    const loan = await loan_applications.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    await loan.update(req.body);
    // Log action
    await staff_logs.create({ user_id: userId, action: 'updated loan'});
    res.status(200).json({message: 'Loan updated successfully', loan});
  } catch (err) {
    res.status(500).json({ message: 'Error updating loan', error: err });
  }
};

// Delete Loan
const deleteLoan = async (req, res) => {
  const userId  = req.user.id;
  try {
    const loan = await loan_applications.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    await loan.destroy();
    // Log action
    await staff_logs.create({ user_id: userId, action: 'deleted loan'});
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting loan', error: err });
  }
};

// Approve Loan
const approveLoan = async (req, res) => {
  const userId  = req.user.id;
  try {
    const loan = await loan_applications.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    await loan.update({ status: 'approved' });
    await staff_logs.create({ user_id: userId, action: 'approve loan'});

    // const amortizationSchedule = generateAmortizationSchedule({
    //   loanAmount: parseFloat(loan.applied_amount),
    //   termMonths: loan.loan_term,
    //   interestRate: 12 // Adjust rate as needed
    // });

    // const amortizationRecords = amortizationSchedule.map(item => ({
    //   loan_id: loan.id,
    //   ...item
    // }));

    // await loan_amortizations.bulkCreate(amortizationRecords);
  
    res.status(200).json({ message: 'Loan approved' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving loan', error: err });
  }
};

// Decline Loan
const declineLoan = async (req, res) => {
  const userId  = req.user.id;
  try {
    const loan = await loan_applications.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    await loan.update({ status: 'declined' });
    // Log action
    await staff_logs.create({ user_id: userId, action: 'decline loan'});
    res.status(200).json({ message: 'Loan declined' });
  } catch (err) {
    res.status(500).json({ message: 'Error declining loan', error: err });
  }
};

// Export controller functions
module.exports = {
  createLoan,
  getAllLoans,
  getLoanById, getLoanByMakerId,
  updateLoan,
  deleteLoan,
  approveLoan,
  declineLoan,
  getTotalApplicationsThisMonth, getTotalLoanAmountThisMonth,
  getTotalActiveLoans, getTotalPaidLoans,
  getApplicationsbyMonth, getApplicationsPerStatus,
  getMostRecentPayments
};
