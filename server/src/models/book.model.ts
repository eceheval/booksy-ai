import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, 
    
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    
    genres: { type: [String], default: [] }, 
    
    language: { type: String, trim: true },
    description: { type: String, trim: true },
    coverImage: { type: String },
    
    embedding: {
      type: [Number], 
      default: [],
    },
    embeddingReady: {
      type: Boolean,
      default: false,
    },
    
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

bookSchema.index({ title: "text" });

export default mongoose.model("Book", bookSchema);