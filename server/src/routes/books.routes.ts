import { Router } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  recommendBooks,
} from "../controllers/books.controller";

const router = Router();

router.get("/", getBooks);
router.post("/", createBook);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.get("/recommend", recommendBooks);

export default router;
