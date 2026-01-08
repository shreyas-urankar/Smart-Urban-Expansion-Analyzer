import mongoose from "mongoose";
import Population from "../models/populationModel.js";
import XLSX from "xlsx";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const filePath = path.join(__dirname, "../../data/population/Updated_Pune_Population_Cleaned.xlsx");

async function importData() {
  try {
    await connectDB();
    
    console.log("📂 Reading Excel file:", filePath);
    
    // Check if file exists
    const fs = await import('fs');
    if (!fs.existsSync(filePath)) {
      console.error("❌ Excel file not found at:", filePath);
      process.exit(1);
    }
    
    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    console.log("✅ Excel file loaded. Sheets:", workbook.SheetNames);
    
    // Use Pune_Summary sheet
    const sheet = workbook.Sheets["Pune_Summary"];
    const sheetName = "Pune_Summary";
    
    if (!sheet) {
      console.error("❌ Pune_Summary sheet not found");
      process.exit(1);
    }
    
    console.log(`✅ Using sheet: ${sheetName}`);
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(sheet);
    console.log(`✅ Converted ${rawData.length} rows to JSON`);
    
    if (rawData.length === 0) {
      console.error("❌ No data found in the sheet");
      process.exit(1);
    }
    
    // Log first row
    console.log("\n📋 Sample row structure:");
    console.log(JSON.stringify(rawData[0], null, 2));
    
    // Calculate growth rate and density
    const sortedData = rawData.sort((a, b) => a.year - b.year);
    
    const transformedData = sortedData.map((row, index) => {
      const currentYear = parseInt(row.year);
      const currentPopulation = parseInt(row.totalPopulation);
      
      // Calculate growth rate (compared to previous year)
      let growthRate = 0;
      if (index > 0) {
        const prevPopulation = parseInt(sortedData[index - 1].totalPopulation);
        growthRate = ((currentPopulation - prevPopulation) / prevPopulation * 100).toFixed(2);
      }
      
      // Estimate density (population / estimated area of Pune: 331 km²)
      const puneArea = 331; // km²
      const density = Math.round(currentPopulation / puneArea);
      
      // Estimate age groups based on children_0_6
      const childrenUnder6 = parseInt(row.children_0_6) || 0;
      
      // Calculate percentages based on common Indian demographics
      const ageGroups = {
        "0-14": Math.round((childrenUnder6 * 2.5 / currentPopulation * 100) * 10) / 10 || 25, // Estimated
        "15-24": 22, // Estimated percentage
        "25-54": 38, // Estimated percentage
        "55-64": 10, // Estimated percentage
        "65+": 5     // Estimated percentage
      };
      
      // Ensure percentages add up to ~100
      const totalPercent = Object.values(ageGroups).reduce((a, b) => a + b, 0);
      if (totalPercent !== 100) {
        // Adjust the largest group to make it 100%
        const largestKey = Object.keys(ageGroups).reduce((a, b) => ageGroups[a] > ageGroups[b] ? a : b);
        ageGroups[largestKey] += (100 - totalPercent);
        ageGroups[largestKey] = Math.round(ageGroups[largestKey] * 10) / 10;
      }
      
      return {
        city: row.city || "Pune",
        year: currentYear,
        totalPopulation: currentPopulation,
        growthRate: parseFloat(growthRate),
        density: density,
        ageGroups: ageGroups,
        source: "Census",
        metadata: {
          lastUpdated: new Date(),
          dataQuality: "Medium"  // Changed from "Estimated from available data" to "Medium"
        }
      };
    });
    
    console.log(`\n✅ Transformed ${transformedData.length} records`);
    
    // Clear old data
    await Population.deleteMany({ city: "Pune" });
    console.log("🧹 Cleared existing Pune data");
    
    // Insert new data
    const result = await Population.insertMany(transformedData);
    
    console.log(`✅ Successfully imported ${result.length} records`);
    
    // Show imported data
    console.log("\n📊 Imported Data Summary:");
    console.log("=========================");
    result.forEach(item => {
      console.log(`   Year ${item.year}: ${(item.totalPopulation/1000000).toFixed(2)}M, ${item.growthRate}% growth, ${item.density}/km²`);
      console.log(`     Age Groups: 0-14: ${item.ageGroups["0-14"]}%, 15-24: ${item.ageGroups["15-24"]}%, 25-54: ${item.ageGroups["25-54"]}%`);
    });
    
    // Verify
    const count = await Population.countDocuments({ city: "Pune" });
    console.log(`\n✅ Total Pune records in database: ${count}`);
    
    // Show data for dashboard
    console.log("\n🎉 Your Dashboard will show:");
    console.log("===========================");
    console.log(`• Latest Population: ${(result[result.length-1].totalPopulation/1000000).toFixed(2)} Million`);
    console.log(`• Average Growth Rate: ${(result.reduce((sum, item) => sum + item.growthRate, 0) / result.length).toFixed(2)}%`);
    console.log(`• Latest Density: ${result[result.length-1].density.toLocaleString()}/km²`);
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Import failed:", error.message);
    process.exit(1);
  }
}

// Run import
importData();