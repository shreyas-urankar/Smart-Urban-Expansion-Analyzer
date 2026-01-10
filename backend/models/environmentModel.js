import mongoose from "mongoose";

const environmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  username: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    default: "Pune"
  },
  aqi: {
    type: Number,
    required: true,
    min: 0,
    max: 500
  },
  pm25: {
    type: Number,
    required: true,
    min: 0
  },
  pm10: {
    type: Number,
    required: true,
    min: 0
  },
  co2: {
    type: Number,
    required: true,
    min: 0
  },
  greenCover: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  waterQuality: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },
  temperature: {
    type: Number,
    default: 28
  },
  humidity: {
    type: Number,
    min: 0,
    max: 100,
    default: 60
  },
  windSpeed: {
    type: Number,
    default: 8
  },
  pollutionLevel: {
    type: String,
    enum: ["Good", "Moderate", "Unhealthy", "Hazardous"],
    default: "Moderate"
  },
  source: {
    type: String,
    enum: ["API", "User", "System", "Test"],
    default: "User"
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
environmentSchema.index({ userId: 1, city: 1, createdAt: -1 });
environmentSchema.index({ username: 1, createdAt: -1 });

const Environment = mongoose.model("Environment", environmentSchema);

export default Environment;