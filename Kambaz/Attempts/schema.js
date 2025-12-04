import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
    {
        _id: String,
        quiz: String,
        user: String,
        answers: [
            {
                questionId: String,
                answer: mongoose.Schema.Types.Mixed,
            },
        ],
        score: { type: Number, default: 0 },
        submittedAt: { type: Date, default: Date.now },
    },
    { collection: "attempts" }
);

export default attemptSchema;