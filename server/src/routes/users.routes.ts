import { Router } from "express";
import User from "../models/user.model";
const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({ email, genres: [] });
    }
    
    res.json({ status: "success", user });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Giriş yapılamadı" });
  }
});

router.post("/update-genres", async (req, res) => {
  try {
    const { email, genres } = req.body;
    await User.findOneAndUpdate({ email }, { genres }, { upsert: true });
    res.json({ status: "success", message: "Türler başarıyla DB'ye kaydedildi" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Kaydedilemedi" });
  }
});

router.post("/favorites", async (req, res) => {
  try {
    const { email, book } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { favorites: book } }, 
      { new: true }
    );
    res.json({ status: "success", user });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Favori kaydedilemedi" });
  }
});

export default router;