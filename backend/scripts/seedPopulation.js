import mongoose from "mongoose";
import dotenv from "dotenv";
import Population from "../models/populationModel.js";

dotenv.config();

const seedData = [
  {
    city: "Pune",
    year: 2000,
    totalPopulation: 2540000,
    growthRate: 2.1,
    density: 4500,
    ageGroups: {
      "0-14": 28.5,
      "15-24": 20.3,
      "25-54": 38.2,
      "55-64": 8.1,
      "65+": 4.9
    },
    source: "Census"
  },
  {
    city: "Pune",
    year: 2005,
    totalPopulation: 3125000,
    growthRate: 2.3,
    density: 5500,
    ageGroups: {
      "0-14": 27.8,
      "15-24": 21.5,
      "25-54": 37.8,
      "55-64": 8.5,
      "65+": 4.4
    },
    source: "Census"
  },
  {
    city: "Pune",
    year: 2010,
    totalPopulation: 3850000,
    growthRate: 2.4,
    density: 6800,
    ageGroups: {
      "0-14": 26.5,
      "15-24": 22.1,
      "25-54": 38.5,
      "55-64": 8.7,
      "65+": 4.2
    },
    source: "Census"
  },
  {
    city: "Pune",
    year: 2015,
    totalPopulation: 4750000,
    growthRate: 2.5,
    density: 8400,
    ageGroups: {
      "0-14": 25.2,
      "15-24": 23.4,
      "25-54": 38.8,
      "55-64": 9.1,
      "65+": 3.5
    },
    source: "Census"
  },
  {
    city: "Pune",
    year: 2020,
    totalPopulation: 5870000,
    growthRate: 2.6,
    density: 10400,
    ageGroups: {
      "0-14": 24.1,
      "15-24": 24.8,
      "25-54": 39.2,
      "55-64": 9.4,
      "65+": 2.5
    },
    source: "Census"
  }
];

// Function that can be imported
export const seedPopulationData = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // Clear existing data
    await Population.deleteMany({ city: "Pune" });

    // Insert new data
    const result = await Population.insertMany(seedData);

    // Verify
    const count = await Population.countDocuments({ city: "Pune" });
    
    console.log(`✅ Population data seeded successfully! (${count} records)`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

// Main function for direct execution
const main = async () => {
  try {
    console.log("Starting population data seeding...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Run the seed function
    await seedPopulationData();

    // Show sample data
    const sample = await Population.find({ city: "Pune" }).sort({ year: 1 });
    console.log("\n📊 Sample Data:");
    sample.forEach(item => {
      console.log(`   ${item.year}: ${(item.totalPopulation/1000000).toFixed(1)}M people`);
    });

    console.log("\n✅ Seed completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

// Only run if called directly (not imported)
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].includes('seedPopulation.js')) {
  main();
}