import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  username: { type: String, required: true },
  analysisResult: { type: String, required: true },
  pollutionLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  city: { type: String, required: true },
  population: { type: String },
  density: { type: String },
  growth: { type: String },
  urbanData: {
    greenSpaces: { type: Number },
    trafficIndex: { type: Number },
    housingIndex: { type: Number },
    employmentRate: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

const Data = mongoose.model("Data", dataSchema);
export default Data;