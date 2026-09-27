
const mongoose = require("mongoose");
const HealthRecord = require("../models/HealthRecord");

// Create Health Record
const createHealthRecord = async (req, res) => {
    try {
        const {
            age,
            gender,
            bloodGroup,
            height,
            weight,
            medicalConditions,
            allergies,
            medications
        } = req.body;

        // Get user ID from verified JWT
        const userId = req.user.id;

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
        console.error("Create Health Record Error:", error);

        if (error.name === "ValidationError") {
            const message = Object.values(error.errors)
                .map(err => err.message)
                .join(", ");

            return res.status(400).json({ message });
        }

        res.status(500).json({
            message: "Unable to save health record"
        });
    }
};


// Get All Health Records
const getHealthRecord = async (req, res) => {
    try {
        // Get user ID from verified JWT
        const userId = req.user.id;

        const records = await HealthRecord.find({ userId })
            .sort({ createdAt: -1 });

        // Return empty array instead of 404
        res.status(200).json(records);

    } catch (error) {
        console.error("Get Health Records Error:", error);

        res.status(500).json({
            message: "Unable to fetch health records"
        });
    }
};


// Update Health Record
const updateHealthRecord = async (req, res) => {
    try {
        // Get user ID from verified JWT
        const userId = req.user.id;

        const recordId = req.body.recordId;

        if (!recordId) {
            return res.status(400).json({
                message: "Record ID is required"
            });
        }

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(recordId)) {
            return res.status(400).json({
                message: "Invalid record ID"
            });
        }

        // Remove protected fields
        const updateData = { ...req.body };

        delete updateData.userId;
        delete updateData.recordId;

        const updatedRecord =
            await HealthRecord.findOneAndUpdate(
                {
                    _id: recordId,
                    userId
                },
                updateData,
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
        console.error("Update Health Record Error:", error);

        if (error.name === "ValidationError") {
            const message = Object.values(error.errors)
                .map(err => err.message)
                .join(", ");

            return res.status(400).json({ message });
        }

        res.status(500).json({
            message: "Unable to update health record"
        });
    }
};


// Delete Health Record
const deleteHealthRecord = async (req, res) => {
    try {
        // Get user ID from verified JWT
        const userId = req.user.id;

        const recordId = req.params.id;

        if (!recordId) {
            return res.status(400).json({
                message: "Record ID is required"
            });
        }

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(recordId)) {
            return res.status(400).json({
                message: "Invalid record ID"
            });
        }

        const deletedRecord =
            await HealthRecord.findOneAndDelete({
                _id: recordId,
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
        console.error("Delete Health Record Error:", error);

        res.status(500).json({
            message: "Unable to delete health record"
        });
    }
};


module.exports = {
    createHealthRecord,
    getHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
};