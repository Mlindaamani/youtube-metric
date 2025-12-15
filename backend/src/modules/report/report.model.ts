import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  title: { type: String, required: true },
  period: { type: String, required: true },
  filePath: { type: String, required: true },
  insights: [String],
  generatedBy: { type: String, enum: ["manual", "scheduled"], required: true },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Report", ReportSchema);
