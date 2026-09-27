
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createHealthRecord,
    getHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
} = require("../controllers/healthController");


// Create
router.post("/save", authMiddleware, createHealthRecord);


// Read All Records
router.get("/record", authMiddleware, getHealthRecord);


// Update Specific Record
router.put("/update", authMiddleware, updateHealthRecord);


// Delete Specific Record
router.delete("/delete/:id", authMiddleware, deleteHealthRecord);


module.exports = router;