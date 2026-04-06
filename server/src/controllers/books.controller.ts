import { Request, Response } from "express";
import path from "path";
import Book from "../models/book.model";
import { extractTextFromImage } from "../services/ai.service";
import { getBookMetadata } from "../services/metadata.service";
import { generateEmbedding } from "../services/embedding.service";

export const scanAndRecommend = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Fotoğraf yükleyin." });
    console.log("Gelen Gövde (Body):", req.body);
    const userEmail = req.body.userEmail;
    const userGenres = req.body.userGenres ? JSON.parse(req.body.userGenres) : [];
    
    const userBookCount = await Book.countDocuments({ userId: userEmail });

    console.log(`Kullanıcı: ${userEmail}, Kütüphane Kitap Sayısı: ${userBookCount}`);

    const imagePath = path.join(__dirname, "../../uploads/covers", req.file.filename);
    const rawText = await extractTextFromImage(imagePath);
    
    if (!rawText) return res.status(422).json({ error: "Metin okunamadı." });

    const lines = rawText.split('\n').filter(l => l.trim().length > 4).slice(0, 3);
    const foundRecommendations = [];


    for (const line of lines) {
      const metadata = await getBookMetadata(line);
      if (metadata) {
        const candidateVector = await generateEmbedding(`${metadata.title} ${metadata.description}`);
        
        let matches = [];
        
        if (userBookCount > 0) {
          try {
            matches = await Book.aggregate([
              {
                $vectorSearch: {
                  index: "vector_index", 
                  path: "embedding",
                  queryVector: candidateVector,
                  numCandidates: 10,
                  limit: 1,
                  filter: { ownerEmail: { $eq: userEmail } }
                }
              }
            ]);
          } catch (vectorErr) {
            console.error("Vektör arama hatası (Index hazır olmayabilir):", vectorErr);
          }
        }

        const isGenreMatch = userGenres.some((g: string) => 
          metadata.description.toLowerCase().includes(g.toLowerCase()) || 
          metadata.title.toLowerCase().includes(g.toLowerCase())
        );

        let finalScore = matches[0] ? (matches[0].score || 0.5) : 0.4;
        if (isGenreMatch) finalScore += 0.3;

        foundRecommendations.push({
          detectedBook: metadata.title,
          author: metadata.author,
          matchScore: finalScore > 1 ? 1 : finalScore,
          reason: isGenreMatch 
            ? `Bu kitap tam senin sevdiğin türlerde!` 
            : (matches[0] ? `Kütüphanendeki "${matches[0].title}" tarzında.` : "Kütüphanen boş olduğu için genel bir puan verildi.")
        });
      }
    }

    res.json({
      message: "Analiz tamam!",
      results: foundRecommendations.sort((a, b) => b.matchScore - a.matchScore)
    });
  } catch (error) {
    console.error("Scan Error:", error);
    res.status(500).json({ error: "Teknik hata oluştu!" });
  }
};


export const createBook = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Kapak fotoğrafı gerekli." });

    const userEmail = req.body.userEmail || req.body.ownerEmail; 
    
    const imagePath = path.join(__dirname, "../../uploads/covers", req.file.filename);
    const rawText = await extractTextFromImage(imagePath);
    
    if (!rawText) return res.status(422).json({ error: "Görselden metin okunamadı." });

    const metadata = await getBookMetadata(rawText);
    if (!metadata) return res.status(404).json({ error: "Kitap bilgileri bulunamadı." });

    const vector = await generateEmbedding(`${metadata.title} ${metadata.description}`);

    const newBook = await Book.create({
      ...metadata,
      userId: userEmail,     
      ownerEmail: userEmail,  
      coverImage: req.file.filename,
      embedding: vector,
      embeddingReady: vector.length > 0
    });

    res.status(201).json({ message: "Kitap kütüphaneye eklendi!", data: newBook });
  } catch (error) {
    console.error("Create Error:", error); 
    res.status(500).json({ error: "Kitap eklenirken hata oluştu." });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { email } = req.query; 
    const books = await Book.find({ ownerEmail: email }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Kitaplar yüklenemedi." });
  }
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
  const { q, email } = req.query;
  const results = await Book.find({ 
    ownerEmail: email, 
    title: { $regex: q as string, $options: "i" } 
  });
  res.json(results);
};