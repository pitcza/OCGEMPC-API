const { makers, loan_applications, loan_amortizations, staff_logs } = require('../models');

const createMaker = async (req, res) => {
  try {
    const newMaker = await makers.create(req.body);
    res.status(201).json(newMaker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create maker', error: err });
  }
};

const getAllMakers = async (req, res) => {
  try {
    const allMakers = await makers.findAll({
        include: [{ model: loan_amortizations }]
    });
    res.status(200).json(allMakers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch makers', error: err });
  }
};

const getMakerById = async (req, res) => {
  try {
    const maker = await makers.findByPk(req.params.id, {
      include: [{ model: loan_amortizations }]
    });

    if (!maker) {
      return res.status(404).json({ message: 'Maker not found' });
    }

    res.status(200).json(maker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch maker', error: err });
  }
};

const updateMaker = async (req, res) => {
  try {
    const maker = await makers.findByPk(req.params.id);
    if (!maker) {
      return res.status(404).json({ message: 'Maker not found' });
    }

    await maker.update(req.body);
    res.status(200).json(maker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update maker', error: err });
  }
};

const deleteMaker = async (req, res) => {
  try {
    const maker = await makers.findByPk(req.params.id);
    if (!maker) {
      return res.status(404).json({ message: 'Maker not found' });
    }

    await maker.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete maker', error: err });
  }
};

module.exports = {
  createMaker,
  getAllMakers,
  getMakerById,
  updateMaker,
  deleteMaker
};