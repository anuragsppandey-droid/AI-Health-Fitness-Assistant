/* Import */

const mongoose = require("mongoose");


/* User Schema */

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: true
    }

}, { timestamps: true });


/* Export */

module.exports = mongoose.model("User", userSchema);