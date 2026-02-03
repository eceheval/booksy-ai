import express from "express";
import cors from "cors";
import booksRouter from "./routes/books.routes";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "booksy-ai-backend" });
});

// routes
app.use("/books", booksRouter);

export default app;
