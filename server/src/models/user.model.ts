import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  genres: { type: [String], default: [] },
  favorites: [Object]
}, { timestamps: true });

export default mongoose.model("User", userSchema);