/* Import */

const mongoose = require("mongoose");


/* Health Record Schema */

const healthRecordSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    age: {
        type: Number,
        required: true,
        min: [1, "Age must be at least 1"],
        max: [120, "Age cannot be more than 120"]
    },

    gender: {
        type: String,
        required: true,
        trim: true
    },

    bloodGroup: {
        type: String,
        trim: true
    },

    height: {
        type: Number,
        min: [30, "Height must be at least 30 cm"],
        max: [250, "Height cannot be more than 250 cm"]
    },

    weight: {
        type: Number,
        min: [2, "Weight must be at least 2 kg"],
        max: [300, "Weight cannot be more than 300 kg"]
    },

    medicalConditions: {
        type: String,
        trim: true
    },

    allergies: {
        type: String,
        trim: true
    },

    medications: {
        type: String,
        trim: true
    }

}, { timestamps: true });


/* Export */

module.exports = mongoose.model("HealthRecord", healthRecordSchema);