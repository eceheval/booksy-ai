import { Router } from "express";
import { uploadCover } from "../middlewares/upload.middleware";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  scanAndRecommend
} from "../controllers/books.controller";

const router = Router();

router.post("/scan", uploadCover.single("cover"), scanAndRecommend);
router.get("/search", searchBooks);

router.get("/", getBooks);
router.post("/", uploadCover.single("cover"), createBook);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;