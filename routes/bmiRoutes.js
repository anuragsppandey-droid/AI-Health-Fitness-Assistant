const express = require("express");

const router = express.Router();

const {
    saveBMI,
    getBMIHistory,
    getUserBMI
} = require("../controllers/bmiController");

// Save BMI
router.post("/save", saveBMI);

// Get BMI History
router.get("/history/:userId", getBMIHistory);

// Get User BMI
router.get("/user/:userId", getUserBMI);

module.exports = router;