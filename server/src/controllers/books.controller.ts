import { Request, Response } from "express";
import path from "path";
import Book from "../models/book.model";
import { extractTextFromImage } from "../services/ai.service";
import { getBookMetadata } from "../services/metadata.service";
import { generateEmbedding } from "../services/embedding.service";

export const scanAndRecommend = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Lütfen bir fotoğraf yükleyin." });
    }

    const imagePath = path.join(__dirname, "../../uploads/covers", req.file.filename);

    const rawText = await extractTextFromImage(imagePath);
    if (!rawText || rawText.trim().length === 0) {
      return res.status(422).json({ error: "Görselden anlamlı bir metin okunamadı." });
    }

    const lines = rawText.split('\n').filter(l => l.trim().length > 4).slice(0, 5);
    
    const myLibrary = await Book.find({ embeddingReady: true });
    if (myLibrary.length === 0) {
      return res.status(400).json({ error: "Önce kütüphanenize birkaç kitap eklemelisiniz." });
    }

    const foundRecommendations = [];

    for (const line of lines) {
      const metadata = await getBookMetadata(line);
      if (metadata) {
        const candidateVector = await generateEmbedding(`${metadata.title} ${metadata.description}`);
        
        const match = await Book.aggregate([
          {
            $vectorSearch: {
              index: "vector_index", 
              path: "embedding",
              queryVector: candidateVector,
              numCandidates: 10,
              limit: 1
            }
          },
          { $project: { title: 1, score: { $meta: "vectorSearchScore" } } }
        ]);

        foundRecommendations.push({
          detectedBook: metadata.title,
          author: metadata.author,
          matchScore: match[0]?.score || 0,
          reason: match[0] ? `Kütüphanendeki "${match[0].title}" kitabına benziyor.` : "Zevkinle düşük eşleşme."
        });
      }
    }

    res.json({
      message: "Raf analizi tamamlandı!",
      results: foundRecommendations.sort((a, b) => b.matchScore - a.matchScore)
    });

  } catch (error) {
    console.error("Scan Error:", error);
    res.status(500).json({ error: "Tarama motorunda teknik bir hata oluştu." });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Kapak fotoğrafı gerekli." });

    const imagePath = path.join(__dirname, "../../uploads/covers", req.file.filename);
    const rawText = await extractTextFromImage(imagePath);
    
    if (!rawText) return res.status(422).json({ error: "Görselden metin okunamadı." });

    const metadata = await getBookMetadata(rawText);
    if (!metadata) return res.status(404).json({ error: "Kitap bilgileri bulunamadı." });

    const vector = await generateEmbedding(`${metadata.title} ${metadata.description}`);

    const newBook = await Book.create({
      ...metadata,
      coverImage: req.file.filename,
      embedding: vector,
      embeddingReady: vector.length > 0
    });

    res.status(201).json({ message: "Kitap başarıyla tanındı ve kütüphaneye eklendi!", data: newBook });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ error: "Kitap eklenirken hata oluştu." });
  }
};

export const getBooks = async (_req: Request, res: Response) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
};

export const getBookById = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  book ? res.json(book) : res.status(404).json({ error: "Kitap bulunamadı." });
};

export const updateBook = async (req: Request, res: Response) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteBook = async (req: Request, res: Response) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Kitap kütüphaneden silindi." });
};

export const searchBooks = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const results = await Book.find({ title: { $regex: query, $options: "i" } });
  res.json(results);
};