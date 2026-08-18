const HealthRecord = require("../models/HealthRecord");

// Create Health Record
const createHealthRecord = async (req, res) => {

    try {

        const {
            userId,
            age,
            gender,
            bloodGroup,
            height,
            weight,
            medicalConditions,
            allergies,
            medications
        } = req.body;

        const record = new HealthRecord({
            userId,
            age,
            gender,
            bloodGroup,
            height,
            weight,
            medicalConditions,
            allergies,
            medications
        });

        await record.save();

        res.status(201).json({
            message: "Health Record Saved Successfully",
            record
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// Get Health Record
const getHealthRecord = async (req, res) => {

    try {

        const { userId } = req.params;

        const record = await HealthRecord.findOne({ userId });

        if (!record) {

            return res.status(404).json({
                message: "Health Record Not Found"
            });

        }

        res.status(200).json(record);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// Update Health Record
const updateHealthRecord = async (req, res) => {

    try {

        const { userId } = req.params;

        const updatedRecord = await HealthRecord.findOneAndUpdate(
            { userId },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedRecord) {

            return res.status(404).json({
                message: "Health Record Not Found"
            });

        }

        res.status(200).json({
            message: "Health Record Updated Successfully",
            record: updatedRecord
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// Delete Health Record
const deleteHealthRecord = async (req, res) => {

    try {

        const { userId } = req.params;

        const deletedRecord = await HealthRecord.findOneAndDelete({
            userId
        });

        if (!deletedRecord) {

            return res.status(404).json({
                message: "Health Record Not Found"
            });

        }

        res.status(200).json({
            message: "Health Record Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


module.exports = {
    createHealthRecord,
    getHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
};