const { Op } = require("sequelize");

const {
  makers,
  loan_applications,
  loan_amortizations,
  staff_logs,
  comakers,
} = require("../models");

const {
  stringSimilarity,
  numericSimilarity,
  dateSimilarity,
} = require("../utils/similarityHelpers");

const { fieldWeights, thresholds } = require("../config/duplicateCheckConfig");

// Calculate total possible score once
const totalPossibleScore = Object.values(fieldWeights).reduce(
  (a, b) => a + b,
  0
);

const createMaker = async (req, res) => {
  const userId = req.user.id;
  try {
    // Validate required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "address",
      "phone_num",
      "birthdate",
      "age",
      "dept",
      "position",
      "salary",
      "ee_status",
      "years_coop",
      "share_amount",
      "saving_amount",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Create the maker
    const newMaker = await makers.create({
      ...req.body,
      created_by: userId,
    });

    // Log the action
    await staff_logs.create({
      user_id: userId,
      action: "create maker account",
      details: `Created maker account for ${req.body.first_name} ${req.body.last_name}`,
    });

    res.status(201).json({
      success: true,
      message: "Maker created successfully",
      data: newMaker,
    });
  } catch (err) {
    console.error("Error creating maker:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create maker",
      error: err.message,
    });
  }
};

const createComaker = async (req, res) => {
  const userId = req.user.id;
  try {
    const newComaker = await comakers.create(req.body);
    res.status(201).json(newComaker);

    await staff_logs.create({
      user_id: userId,
      action: "create maker account",
      details: `Created maker account for ${req.body.first_name} ${req.body.last_name}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create comaker", error: err });
  }
};

const getAllMakers = async (req, res) => {
  try {
    const allMakers = await makers.findAll({
      include: [{ model: loan_amortizations }, { model: loan_applications }],
    });
    res.status(200).json(allMakers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch makers", error: err });
  }
};

const getAllComakers = async (req, res) => {
  const userId = req.user.id;
  try {
    const allComakers = await comakers.findAll({
      include: [
        {
          model: loan_applications,
          through: { attributes: [] }, // this hides `loan_comakers` join table data
          include: [
            {
              model: loan_amortizations,
            },
          ],
        },
      ],
    });
    res.status(200).json(allComakers);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch all comakers", error: err });
  }
};

const getMakerById = async (req, res) => {
  try {
    const maker = await makers.findByPk(req.params.id, {
      include: [{ model: loan_amortizations }, { model: loan_applications }],
    });

    if (!maker) {
      return res.status(404).json({ message: "Maker not found" });
    }

    res.status(200).json(maker);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch maker", error: err });
  }
};

const getComakerById = async (req, res) => {
  try {
    const comaker = await comakers.findByPk(req.params.id, {
      include: [
        {
          model: loan_applications,
          through: { attributes: [] }, // this hides `loan_comakers` join table data
          include: [
            {
              model: loan_amortizations,
            },
          ],
        },
      ],
    });

    if (!comaker) {
      return res.status(404).json({ message: "Comaker not found" });
    }

    res.status(200).json(comaker);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comaker", error: err });
  }
};

const updateMaker = async (req, res) => {
  const userId = req.user.id;
  try {
    const maker = await makers.findByPk(req.params.id);
    if (!maker) {
      return res.status(404).json({ message: "Maker not found" });
    }

    await maker.update(req.body);
    // Log action
    await staff_logs.create({ user_id: userId, action: "update maker" });
    res.status(200).json(maker);
  } catch (err) {
    res.status(500).json({ message: "Failed to update maker", error: err });
  }
};

const updateComaker = async (req, res) => {
  const userId = req.user.id;
  try {
    const comaker = await comakers.findByPk(req.params.id);
    if (!comaker) {
      return res.status(404).json({ message: "Comaker not found" });
    }

    await comaker.update(req.body);
    // Log action
    await staff_logs.create({ user_id: userId, action: "update comaker" });
    res.status(200).json(comaker);
  } catch (err) {
    res.status(500).json({ message: "Failed to update comaker", error: err });
  }
};

const deleteMaker = async (req, res) => {
  const userId = req.user.id;
  try {
    const maker = await makers.findByPk(req.params.id);
    if (!maker) {
      return res.status(404).json({ message: "Maker not found" });
    }

    await maker.destroy();
    // Log action
    await staff_logs.create({ user_id: userId, action: "delete maker" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete maker", error: err });
  }
};

const deleteComaker = async (req, res) => {
  const userId = req.user.id;
  try {
    const comaker = await comakers.findByPk(req.params.id);
    if (!comaker) {
      return res.status(404).json({ message: "Comaker not found" });
    }

    await comaker.destroy();
    // Log action
    await staff_logs.create({ user_id: userId, action: "delete comaker" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comaker", error: err });
  }
};

const checkDuplicateMaker = async (req, res) => {
  try {
    const inputData = req.body;
    const potentialMatches = await makers.findAll({
      where: {
        [Op.or]: [
          { first_name: inputData.first_name },
          { last_name: inputData.last_name },
          { phone_num: inputData.phone_num },
        ],
      },
    });

    const matches = potentialMatches.map((existingMaker) => {
      let score = 0;

      // Calculate score for each field
      for (const [field, weight] of Object.entries(fieldWeights)) {
        let fieldScore = 0;

        if (field === "birthdate") {
          fieldScore = dateSimilarity(inputData[field], existingMaker[field]);
        } else if (
          ["salary", "share_amount", "saving_amount"].includes(field)
        ) {
          fieldScore = numericSimilarity(
            inputData[field],
            existingMaker[field]
          );
        } else {
          fieldScore = stringSimilarity(inputData[field], existingMaker[field]);
        }

        score += fieldScore * weight;
      }

      const confidence = (score / totalPossibleScore) * 100;
      return { ...existingMaker.toJSON(), confidence };
    });

    // Filter and sort results
    const filteredMatches = matches
      .filter((m) => m.confidence >= 70) // Only show matches with >=70% confidence
      .sort((a, b) => b.confidence - a.confidence);

    // Categorize results
    const result = {
      exactMatch: filteredMatches.find((m) => m.confidence === 100),
      potentialMatches: filteredMatches.filter((m) => m.confidence < 100),
    };

    res.status(200).json({
      success: true,
      data: result,
      message: "Duplicate check completed",
    });
  } catch (err) {
    console.error("Error checking duplicates:", err);
    res.status(500).json({
      success: false,
      message: "Failed to check duplicates",
      error: err.message,
    });
  }
};

module.exports = {
  checkDuplicateMaker,
  createMaker,
  createComaker,
  getAllMakers,
  getAllComakers,
  getMakerById,
  getComakerById,
  updateMaker,
  updateComaker,
  deleteMaker,
  deleteComaker,
};
