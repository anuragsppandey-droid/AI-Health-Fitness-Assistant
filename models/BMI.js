const mongoose = require("mongoose");

const bmiSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    height: {
        type: Number,
        required: true
    },

    weight: {
        type: Number,
        required: true
    },

    bmi: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("BMI", bmiSchema);