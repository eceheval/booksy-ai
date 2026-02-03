import { Request, Response } from "express";
import { books, Book } from "../data/books";
import { randomUUID } from "crypto";

export const getBooks = (_: Request, res: Response) => {
  res.json(books);
};

export const getBookById = (req: Request, res: Response) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
};

export const createBook = (req: Request, res: Response) => {
  const { title, author, genre, language, coverImage } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "title and author required" });
  }

  const newBook: Book = {
    id: randomUUID(),
    title,
    author,
    genre,
    language,
    coverImage,
    embeddingReady: false,
    createdAt: new Date().toISOString(),
  };

  books.push(newBook);

  res.status(201).json(newBook);
};

export const updateBook = (req: Request, res: Response) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
};

export const deleteBook = (req: Request, res: Response) => {
  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted", book: deleted[0] });
};

export const recommendBooks = (_: Request, res: Response) => {
  const recommendations = books
    .filter((b) => b.genre)
    .slice(0, 3);

  res.json({
    message: "Mock recommendations",
    recommendations,
  });
};
