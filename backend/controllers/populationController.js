import Population from "../models/populationModel.js";

// ✅ Save population data
export const savePopulation = async (req, res) => {
  try {
    const {
      city,
      year,
      totalPopulation,
      growthRate,
      density,
      ageGroups
    } = req.body;

    // Check if data for this city and year already exists
    const existing = await Population.findOne({ city, year });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Population data for this city and year already exists"
      });
    }

    const newPopulation = new Population({
      city,
      year,
      totalPopulation,
      growthRate,
      density,
      ageGroups,
      source: "Census"
    });

    await newPopulation.save();

    res.status(201).json({
      success: true,
      message: "Population data saved successfully",
      data: newPopulation
    });
  } catch (error) {
    console.error("❌ Save Population Error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving population data",
      error: error.message
    });
  }
};

// ✅ Get population by city
export const getPopulationByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { startYear, endYear } = req.query;

    let query = { city };
    
    // Add year range filter if provided
    if (startYear || endYear) {
      query.year = {};
      if (startYear) query.year.$gte = parseInt(startYear);
      if (endYear) query.year.$lte = parseInt(endYear);
    }

    const populationData = await Population.find(query)
      .sort({ year: 1 })
      .select('-__v -createdAt -updatedAt');

    if (!populationData.length) {
      return res.status(404).json({
        success: false,
        message: `No population data found for ${city}`
      });
    }

    res.status(200).json({
      success: true,
      message: `Population data for ${city} retrieved successfully`,
      data: populationData,
      count: populationData.length
    });
  } catch (error) {
    console.error("❌ Get Population Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving population data",
      error: error.message
    });
  }
};

// ✅ Predict future population (simple linear regression)
export const predictPopulation = async (req, res) => {
  try {
    const { city } = req.params;
    const { targetYear } = req.query;
    
    if (!targetYear || targetYear <= 2020) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid target year after 2020"
      });
    }

    // Get historical data
    const historicalData = await Population.find({ 
      city, 
      year: { $lte: 2020 } 
    }).sort({ year: 1 });

    if (historicalData.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Insufficient historical data for prediction"
      });
    }

    // Simple linear regression for prediction
    const years = historicalData.map(d => d.year);
    const populations = historicalData.map(d => d.totalPopulation);
    
    // Calculate slope (average growth rate)
    const n = years.length;
    let sumXY = 0, sumX = 0, sumY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumXY += years[i] * populations[i];
      sumX += years[i];
      sumY += populations[i];
      sumX2 += years[i] * years[i];
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predict for target year
    const predictedPopulation = Math.round(slope * parseInt(targetYear) + intercept);
    const predictedGrowthRate = (slope / populations[n-1]) * 100;
    
    // Estimate density (assuming area remains constant)
    const latestDensity = historicalData[n-1].density;
    const predictedDensity = Math.round(latestDensity * (predictedPopulation / populations[n-1]));
    
    // Predict age distribution (simple trend continuation)
    const latestAgeGroups = historicalData[n-1].ageGroups;
    const predictedAgeGroups = { ...latestAgeGroups };
    
    // Simple aging trend: decrease in 0-14, increase in 25-54 and 55+
    predictedAgeGroups["0-14"] = Math.max(20, latestAgeGroups["0-14"] * 0.98);
    predictedAgeGroups["15-24"] = latestAgeGroups["15-24"] * 0.99;
    predictedAgeGroups["25-54"] = Math.min(45, latestAgeGroups["25-54"] * 1.01);
    predictedAgeGroups["55-64"] = Math.min(12, latestAgeGroups["55-64"] * 1.02);
    predictedAgeGroups["65+"] = Math.min(15, latestAgeGroups["65+"] * 1.03);

    const prediction = {
      city,
      year: parseInt(targetYear),
      totalPopulation: predictedPopulation,
      growthRate: parseFloat(predictedGrowthRate.toFixed(2)),
      density: predictedDensity,
      ageGroups: predictedAgeGroups,
      source: "Predicted",
      confidence: 0.85, // Confidence score
      model: "Linear Regression",
      historicalDataPoints: n
    };

    res.status(200).json({
      success: true,
      message: `Population prediction for ${city} in ${targetYear}`,
      data: prediction
    });
  } catch (error) {
    console.error("❌ Predict Population Error:", error);
    res.status(500).json({
      success: false,
      message: "Error predicting population",
      error: error.message
    });
  }
};

// ✅ Get population statistics
export const getPopulationStats = async (req, res) => {
  try {
    const { city } = req.params;

    const stats = await Population.aggregate([
      { $match: { city } },
      { $sort: { year: 1 } },
      {
        $group: {
          _id: "$city",
          totalRecords: { $sum: 1 },
          yearsCovered: { $push: "$year" },
          latestYear: { $max: "$year" },
          earliestYear: { $min: "$year" },
          maxPopulation: { $max: "$totalPopulation" },
          minPopulation: { $min: "$totalPopulation" },
          avgGrowthRate: { $avg: "$growthRate" },
          avgDensity: { $avg: "$density" },
          totalPopulationGrowth: {
            $push: {
              year: "$year",
              population: "$totalPopulation",
              growthRate: "$growthRate"
            }
          }
        }
      },
      {
        $project: {
          city: "$_id",
          totalRecords: 1,
          yearsCovered: 1,
          yearRange: {
            start: "$earliestYear",
            end: "$latestYear"
          },
          populationRange: {
            min: "$minPopulation",
            max: "$maxPopulation"
          },
          averageGrowthRate: { $round: ["$avgGrowthRate", 2] },
          averageDensity: { $round: ["$avgDensity", 0] },
          totalGrowth: {
            $subtract: ["$maxPopulation", "$minPopulation"]
          },
          growthPercentage: {
            $multiply: [
              { $divide: [
                { $subtract: ["$maxPopulation", "$minPopulation"] },
                "$minPopulation"
              ]},
              100
            ]
          }
        }
      }
    ]);

    if (!stats.length) {
      return res.status(404).json({
        success: false,
        message: `No statistics found for ${city}`
      });
    }

    res.status(200).json({
      success: true,
      message: `Population statistics for ${city}`,
      data: stats[0]
    });
  } catch (error) {
    console.error("❌ Get Population Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving population statistics",
      error: error.message
    });
  }
};

// ✅ Get all cities with population data
export const getAllCities = async (req, res) => {
  try {
    const cities = await Population.distinct("city");
    
    res.status(200).json({
      success: true,
      message: "Cities with population data retrieved successfully",
      data: cities,
      count: cities.length
    });
  } catch (error) {
    console.error("❌ Get Cities Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving cities",
      error: error.message
    });
  }
};

// ✅ Seed initial population data - DISABLED (use import instead)
export const seedPopulationData = async (req, res) => {
  try {
    res.status(400).json({
      success: false,
      message: "Use importPopulationExcel.js to import real data instead"
    });
  } catch (error) {
    console.error("❌ Seed Population Error:", error);
    res.status(500).json({
      success: false,
      message: "Error seeding population data",
      error: error.message
    });
  }
};