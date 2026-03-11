import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true,
    index: true // optimized for fetching by company
  },
  snippets: {
    javascript: { type: String, required: true },
    python: { type: String, required: true },
    java: { type: String, required: true },
    cpp: { type: String, required: true }
  }
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);

export default Question;
