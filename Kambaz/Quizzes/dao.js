import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
    const findQuizzesForCourse = (courseId) => {
        return model.find({ course: courseId });
    };

    const findQuizById = (quizId) => {
        return model.findById(quizId);
    };

    const createQuiz = (quiz) => {
        const newQuiz = {
            ...quiz,
            _id: uuidv4(),
            published: false,
            questions: [],
        };
        return model.create(newQuiz);
    };

    const updateQuiz = (quizId, quizUpdates) => {
        return model.updateOne({ _id: quizId }, { $set: quizUpdates });
    };

    const deleteQuiz = (quizId) => {
        return model.deleteOne({ _id: quizId });
    };

    const deleteQuizzesForCourse = (courseId) => {
        return model.deleteMany({ course: courseId });
    };

    return {
        findQuizzesForCourse,
        findQuizById,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        deleteQuizzesForCourse,
    };
}