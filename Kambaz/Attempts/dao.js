import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AttemptsDao() {
    const findAttemptsForQuizByUser = (quizId, userId) => {
        return model.find({ quiz: quizId, user: userId });
    };

    const findLatestAttempt = (quizId, userId) => {
        return model.findOne({ quiz: quizId, user: userId }).sort({ submittedAt: -1 });
    };

    const createAttempt = (attempt) => {
        const newAttempt = {
            ...attempt,
            _id: uuidv4(),
            submittedAt: new Date(),
        };
        return model.create(newAttempt);
    };

    const countAttempts = (quizId, userId) => {
        return model.countDocuments({ quiz: quizId, user: userId });
    };

    const deleteAttemptsForQuiz = (quizId) => {
        return model.deleteMany({ quiz: quizId });
    };

    return {
        findAttemptsForQuizByUser,
        findLatestAttempt,
        createAttempt,
        countAttempts,
        deleteAttemptsForQuiz,
    };
}