import mongoose from "mongoose";
import dotenv from "dotenv";
import Population from "../models/populationModel.js";

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    const count = await Population.countDocuments({ city: "Pune" });
    
    if (count > 0) {
      console.log(`✅ Population data exists (${count} records)`);
      
      // Show the data
      const data = await Population.find({ city: "Pune" }).sort({ year: 1 });
      console.log("\n📊 Current Population Data:");
      data.forEach(item => {
        console.log(`   ${item.year}: ${(item.totalPopulation/1000000).toFixed(1)}M people (${item.growthRate}% growth)`);
      });
    } else {
      console.log("❌ No population data found");
      console.log("💡 Run: npm run seed:population");
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking data:", error);
    process.exit(1);
  }
};

checkData();