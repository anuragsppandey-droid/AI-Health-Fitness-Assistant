const express = require("express");

const router = express.Router();

const { chatWithAI } = require("../controllers/chatController");

router.post("/message", chatWithAI);

module.exports = router;