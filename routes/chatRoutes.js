const express = require("express");

const router = express.Router();

const { chatWithAI } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/message", authMiddleware, chatWithAI);

module.exports = router;