const BMI = require("../models/BMI");


// Save BMI Record
const saveBMI = async (req, res) => {
    try {

        const {
            height,
            weight,
            bmi,
            status
        } = req.body;

        // Get user ID from verified JWT
        const userId = req.user.id;

        const bmiRecord = new BMI({
            userId,
            height,
            weight,
            bmi,
            status
        });

        await bmiRecord.save();

        res.status(201).json({
            message: "BMI Saved Successfully"
        });

    } catch (error) {

        console.error("BMI Save Error:", error);

        if (error.name === "ValidationError") {

            const message = Object.values(error.errors)
                .map(err => err.message)
                .join(", ");

            return res.status(400).json({
                message
            });
        }

        res.status(500).json({
            message: "Error saving BMI"
        });
    }
};


// Get All BMI Records
const getBMIHistory = async (req, res) => {
    try {

        // Get user ID from verified JWT
        const userId = req.user.id;

        // Newest record appears first
        const history = await BMI.find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json(history);

    } catch (error) {

        console.error("Get BMI History Error:", error);

        res.status(500).json({
            message: "Unable to fetch BMI history"
        });
    }
};


// Get Latest BMI Record
const getUserBMI = async (req, res) => {
    try {

        // Get user ID from verified JWT
        const userId = req.user.id;

        const bmi = await BMI.findOne({ userId })
            .sort({ createdAt: -1 });

        if (!bmi) {
            return res.status(404).json({
                message: "BMI record not found"
            });
        }

        res.status(200).json(bmi);

    } catch (error) {

        console.error("Get Latest BMI Error:", error);

        res.status(500).json({
            message: "Unable to fetch latest BMI"
        });
    }
};


// Delete BMI Record
const deleteBMI = async (req, res) => {
    try {

        const userId = req.user.id;
        const bmiId = req.params.id;

        const deletedBMI = await BMI.findOneAndDelete({
            _id: bmiId,
            userId: userId
        });

        if (!deletedBMI) {
            return res.status(404).json({
                message: "BMI record not found"
            });
        }

        res.status(200).json({
            message: "BMI record deleted successfully"
        });

    } catch (error) {

        console.error("Delete BMI Error:", error);

        res.status(500).json({
            message: "Unable to delete BMI record"
        });
    }
};


module.exports = {
    saveBMI,
    getBMIHistory,
    getUserBMI,
    deleteBMI
};