import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, 
    title: { type: String, default: "Bilinmeyen Kitap" },
    author: { type: String, default: "Bilinmeyen Yazar" },
    genres: { type: [String], default: [] }, 
    language: { type: String, trim: true },
    description: { type: String, trim: true },
    coverImage: { type: String, required: true },
    ownerEmail: { type: String, required: true }, 

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