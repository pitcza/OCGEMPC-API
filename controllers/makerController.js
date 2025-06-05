const { makers, loan_applications, loan_amortizations, staff_logs, comakers } = require('../models');

const createMaker = async (req, res) => {
  const userId = req.user.id;
  try {
    const newMaker = await makers.create(req.body);
    res.status(201).json(newMaker);
    await staff_logs.create({ user_id: userId, action: 'create maker account' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create maker', error: err });
  }
};

const createComaker = async (req, res) => {
  const userId = req.user.id;
  try{
    const newComaker = await comakers.create(req.body);
    res.status(201).json(newComaker);
      await staff_logs.create({ user_id: userId, action: 'create comaker account' });
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to create comaker', error: err});
  }
}

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

const getAllComakers = async (req, res) => {
  const userId = req.user.id;
  try {
    const allComakers = await comakers.findAll({
      include: [{ model: loan_amortizations}]
    })
    res.status(200).json(allComakers)
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch all comakers', error: err})
  }
}

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

const getComakerById = async (req, res) => {
  try {
    const comaker = await comakers.findByPk(req.params.id, {
      include: [{ model: loan_amortizations }]
    });

    if (!comaker) {
      return res.status(404).json({ message: 'Comaker not found' });
    }

    res.status(200).json(comaker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comaker', error: err });
  }
};

const updateMaker = async (req, res) => {
  const userId  = req.user.id;
  try {
    const maker = await makers.findByPk(req.params.id);
    if (!maker) {
      return res.status(404).json({ message: 'Maker not found' });
    }

    await maker.update(req.body);
    // Log action
    await staff_logs.create({ user_id: userId, action: 'update maker'});
    res.status(200).json(maker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update maker', error: err });
  }
};

const updateComaker = async (req, res) => {
  const userId  = req.user.id;
  try {
    const comaker = await comakers.findByPk(req.params.id);
    if (!comaker) {
      return res.status(404).json({ message: 'Comaker not found' });
    }

    await comaker.update(req.body);
    // Log action
    await staff_logs.create({ user_id: userId, action: 'update comaker'});
    res.status(200).json(comaker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comaker', error: err });
  }
};


const deleteMaker = async (req, res) => {
  const userId  = req.user.id;
  try {
    const maker = await makers.findByPk(req.params.id);
    if (!maker) {
      return res.status(404).json({ message: 'Maker not found' });
    }

    await maker.destroy();
    // Log action
    await staff_logs.create({ user_id: userId, action: 'delete maker'});
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete maker', error: err });
  }
};

const deleteComaker = async (req, res) => {
  const userId  = req.user.id;
  try {
    const comaker = await comakers.findByPk(req.params.id);
    if (!comaker) {
      return res.status(404).json({ message: 'Comaker not found' });
    }

    await comaker.destroy();
    // Log action
    await staff_logs.create({ user_id: userId, action: 'delete comaker'});
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comaker', error: err });
  }
};

module.exports = {
  createMaker, createComaker,
  getAllMakers, getAllComakers,
  getMakerById, getComakerById,
  updateMaker, updateComaker,
  deleteMaker, deleteComaker
};