import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    _id: String,
    type: {
        type: String,
        enum: ["multiple-choice", "true-false", "fill-blank"],
        default: "multiple-choice"
    },
    title: String,
    points: { type: Number, default: 0 },
    question: String,
    choices: [{ text: String, isCorrect: Boolean }],
    correctAnswer: Boolean,
    possibleAnswers: [String],
});

const quizSchema = new mongoose.Schema(
    {
        _id: String,
        title: { type: String, default: "Unnamed Quiz" },
        course: String,
        description: String,
        quizType: {
            type: String,
            enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
            default: "Graded Quiz"
        },
        points: { type: Number, default: 0 },
        assignmentGroup: {
            type: String,
            enum: ["Quizzes", "Exams", "Assignments", "Project"],
            default: "Quizzes"
        },
        shuffleAnswers: { type: Boolean, default: true },
        timeLimit: { type: Number, default: 20 },
        multipleAttempts: { type: Boolean, default: false },
        howManyAttempts: { type: Number, default: 1 },
        showCorrectAnswers: { type: String, default: "" },
        accessCode: { type: String, default: "" },
        oneQuestionAtATime: { type: Boolean, default: true },
        webcamRequired: { type: Boolean, default: false },
        lockQuestionsAfterAnswering: { type: Boolean, default: false },
        dueDate: Date,
        availableDate: Date,
        untilDate: Date,
        published: { type: Boolean, default: false },
        questions: [questionSchema],
    },
    { collection: "quizzes" }
);

export default quizSchema;