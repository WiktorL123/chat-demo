import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
    participants: {
        type: [String],
        required: true,
    },
    closedAt: {
        type: Date,
    }
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);