const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    bloodGroup: {
        type: String
    },

    height: {
        type: Number
    },

    weight: {
        type: Number
    },

    medicalConditions: {
        type: String
    },

    allergies: {
        type: String
    },

    medications: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("HealthRecord", healthRecordSchema);