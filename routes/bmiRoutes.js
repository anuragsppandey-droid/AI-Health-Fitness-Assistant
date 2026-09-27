const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    saveBMI,
    getBMIHistory,
    getUserBMI,
    deleteBMI
} = require("../controllers/bmiController");


// Save BMI
router.post("/save", authMiddleware, saveBMI);


// Get BMI History
router.get("/history", authMiddleware, getBMIHistory);


// Get Latest BMI
router.get("/latest", authMiddleware, getUserBMI);


// Delete BMI Record
router.delete("/delete/:id", authMiddleware, deleteBMI);


module.exports = router;