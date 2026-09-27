/* Import */

const mongoose = require("mongoose");


/* BMI Schema */

const bmiSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    height: {
        type: Number,
        required: true,
        min: [30, "Height must be at least 30 cm"],
        max: [250, "Height cannot be more than 250 cm"]
    },

    weight: {
        type: Number,
        required: true,
        min: [2, "Weight must be at least 2 kg"],
        max: [300, "Weight cannot be more than 300 kg"]
    },

    bmi: {
        type: Number,
        required: true,
        min: [5, "BMI value is too low"],
        max: [100, "BMI value is too high"]
    },

    status: {
        type: String,
        required: true,
        trim: true,
        enum: ["Underweight", "Normal Weight", "Overweight", "Obese"]
    }

}, { timestamps: true });


/* Export */

module.exports = mongoose.model("BMI", bmiSchema);