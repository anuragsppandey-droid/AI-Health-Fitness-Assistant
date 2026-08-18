const express = require("express");

const router = express.Router();

const {
    createHealthRecord,
    getHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
} = require("../controllers/healthController");


// Create
router.post("/save", createHealthRecord);


// Read
router.get("/record/:userId", getHealthRecord);


// Update
router.put("/update/:userId", updateHealthRecord);


// Delete
router.delete("/delete/:userId", deleteHealthRecord);


module.exports = router;