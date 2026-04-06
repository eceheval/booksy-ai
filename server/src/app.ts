import express from "express";
import cors from "cors";
import path from "path";
import booksRouter from "./routes/books.routes";
import usersRouter from "./routes/users.routes"; 

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "booksy-ai-backend", timestamp: new Date() });
});

app.use("/books", booksRouter);

app.use("/users", usersRouter);

export default app;