import Data from "../models/dataModel.js";

// ✅ Save prediction / urban data
export const saveData = async (req, res) => {
  try {
    const {
      userId,
      username,
      analysisResult,
      pollutionLevel,
      city,
      population,
      density,
      growth,
      year,
      prediction,
      urbanData,
    } = req.body;

    const newData = new Data({
      userId,
      username,
      action: "PREDICT",
      analysisResult,
      pollutionLevel: pollutionLevel || "Medium",
      city: city || "Unknown City",
      population,
      density,
      growth,
      year,
      prediction,
      urbanData,
    });

    await newData.save();

    res.status(201).json({
      message: "✅ Data saved successfully!",
      data: newData,
    });
  } catch (error) {
    console.error("❌ Save Data Error:", error);
    res.status(500).json({
      message: "❌ Error saving data",
      error: error.message,
    });
  }
};

// ✅ Get all stored data
export const getData = async (req, res) => {
  try {
    const data = await Data.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    res.status(200).json({
      message: "✅ Data fetched successfully!",
      data,
    });
  } catch (error) {
    console.error("❌ Get Data Error:", error);
    res.status(500).json({
      message: "❌ Error retrieving data",
      error: error.message,
    });
  }
};

// ✅ Urban analytics summary
export const getUrbanAnalytics = async (req, res) => {
  try {
    const analytics = await Data.aggregate([
      {
        $group: {
          _id: "$city",
          totalRecords: { $sum: 1 },
          avgPollution: {
            $avg: {
              $switch: {
                branches: [
                  { case: { $eq: ["$pollutionLevel", "Low"] }, then: 1 },
                  { case: { $eq: ["$pollutionLevel", "Medium"] }, then: 2 },
                  { case: { $eq: ["$pollutionLevel", "High"] }, then: 3 },
                ],
                default: 2,
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      message: "✅ Urban analytics generated!",
      analytics,
    });
  } catch (error) {
    console.error("❌ Analytics Error:", error);
    res.status(500).json({
      message: "❌ Error generating analytics",
      error: error.message,
    });
  }
};
