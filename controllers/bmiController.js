const BMI = require("../models/BMI");

// Save BMI Record

const saveBMI = async (req, res) => {

    try {

        const { userId, height, weight, bmi, status } = req.body;

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

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Get All BMI Records

const getBMIHistory = async (req, res) => {

    try {

        const { userId } = req.params;

        const history = await BMI.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(history);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
// Get Latest BMI Record
const getUserBMI = async (req, res) => {

    try {

        const { userId } = req.params;

        const bmi = await BMI.findOne({ userId })
            .sort({ createdAt: -1 });

        if (!bmi) {

            return res.status(404).json({
                message: "BMI record not found"
            });

        }

        res.status(200).json(bmi);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    saveBMI,
    getBMIHistory,
    getUserBMI
};