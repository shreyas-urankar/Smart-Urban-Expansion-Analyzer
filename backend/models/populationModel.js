import mongoose from "mongoose";

const populationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: 2100
  },
  totalPopulation: {
    type: Number,
    required: true,
    min: 0
  },
  growthRate: {
    type: Number,
    required: true,
    min: -100,
    max: 100
  },
  density: {
    type: Number,
    required: true,
    min: 0
  },
  ageGroups: {
    type: Map,
    of: Number,
    required: true,
    default: {
      "0-14": 0,
      "15-24": 0,
      "25-54": 0,
      "55-64": 0,
      "65+": 0
    }
  },
  source: {
    type: String,
    enum: ["Census", "WorldBank", "UN", "Estimated", "Predicted"],
    default: "Census"
  },
  metadata: {
    lastUpdated: { type: Date, default: Date.now },
    dataQuality: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" }
  }
}, {
  timestamps: true
});

// Compound index for fast lookups by city and year
populationSchema.index({ city: 1, year: 1 }, { unique: true });

// Virtual for growth from previous year
populationSchema.virtual('populationGrowth').get(function() {
  // This would be calculated from previous year data
  return this.growthRate;
});

const Population = mongoose.model("Population", populationSchema);
export default Population;