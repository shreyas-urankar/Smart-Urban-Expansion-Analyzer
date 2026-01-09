import mongoose from "mongoose";

const environmentSchema = new mongoose.Schema({
  city: { 
    type: String, 
    required: true,
    index: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  aqi: { 
    type: Number,
    min: 1,
    max: 5
  },
  pm25: { 
    type: Number 
  },
  pm10: { 
    type: Number 
  },
  co2: { 
    type: Number,
    default: 2.0
  },
  greenCover: { 
    type: Number,
    min: 0,
    max: 100,
    default: 25
  },
  waterQuality: { 
    type: String,
    enum: ["Excellent", "Good", "Moderate", "Poor", "Very Poor"],
    default: "Moderate"
  },
  pollutants: {
    co: Number,
    no2: Number,
    o3: Number,
    so2: Number,
    nh3: Number
  }
}, { 
  timestamps: true 
});

// Compound index for city and date queries
environmentSchema.index({ city: 1, date: -1 });

const Environment = mongoose.model("Environment", environmentSchema);
export default Environment;