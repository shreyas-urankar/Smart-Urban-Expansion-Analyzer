import Data from "../models/dataModel.js";

// ✅ Save data to MongoDB
export const saveData = async (req, res) => {
  try {
    const {
      username,
      analysisResult,
      pollutionLevel,
      city,
      population,
      density,
      growth,
      urbanData,
    } = req.body;

    const newData = new Data({
      username,
      analysisResult,
      pollutionLevel: pollutionLevel || "Medium",
      city: city || "Unknown City",
      population,
      density,
      growth,
      urbanData,
      createdAt: new Date(),
    });

    await newData.save();
    res.status(201).json({
      message: "✅ Data saved successfully!",
      data: newData,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error saving data",
      error: error.message,
    });
  }
};

// ✅ Retrieve all stored data
export const getData = async (req, res) => {
  try {
    const data = await Data.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "✅ Data fetched successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error retrieving data",
      error: error.message,
    });
  }
};

// ✅ Get basic analytics (optional summary)
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
    res.status(500).json({
      message: "❌ Error generating analytics",
      error: error.message,
    });
  }
};
