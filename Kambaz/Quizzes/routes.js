import QuizzesDao from "./dao.js";
import AttemptsDao from "../Attempts/dao.js";

export default function QuizRoutes(app) {
    const dao = QuizzesDao();
    const attemptsDao = AttemptsDao();

    const findQuizzesForCourse = async (req, res) => {
        const { courseId } = req.params;
        try {
            const quizzes = await dao.findQuizzesForCourse(courseId);
            res.json(quizzes);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            res.status(500).json({ message: "Failed to fetch quizzes" });
        }
    };

    const findQuizById = async (req, res) => {
        const { quizId } = req.params;
        try {
            const quiz = await dao.findQuizById(quizId);
            res.json(quiz);
        } catch (error) {
            console.error("Error fetching quiz:", error);
            res.status(500).json({ message: "Failed to fetch quiz" });
        }
    };

    const createQuiz = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can create quizzes" });
        }
        const { courseId } = req.params;
        try {
            const quiz = { ...req.body, course: courseId };
            const newQuiz = await dao.createQuiz(quiz);
            res.json(newQuiz);
        } catch (error) {
            console.error("Error creating quiz:", error);
            res.status(500).json({ message: "Failed to create quiz" });
        }
    };

    const updateQuiz = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can update quizzes" });
        }
        const { quizId } = req.params;
        try {
            const status = await dao.updateQuiz(quizId, req.body);
            res.json(status);
        } catch (error) {
            console.error("Error updating quiz:", error);
            res.status(500).json({ message: "Failed to update quiz" });
        }
    };

    const deleteQuiz = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can delete quizzes" });
        }
        const { quizId } = req.params;
        try {
            await attemptsDao.deleteAttemptsForQuiz(quizId);
            const status = await dao.deleteQuiz(quizId);
            res.json(status);
        } catch (error) {
            console.error("Error deleting quiz:", error);
            res.status(500).json({ message: "Failed to delete quiz" });
        }
    };


    const findAttempts = async (req, res) => {
        const { quizId } = req.params;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        try {
            const attempts = await attemptsDao.findAttemptsForQuizByUser(quizId, currentUser._id);
            res.json(attempts);
        } catch (error) {
            console.error("Error fetching attempts:", error);
            res.status(500).json({ message: "Failed to fetch attempts" });
        }
    };

    const findLatestAttempt = async (req, res) => {
        const { quizId } = req.params;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        try {
            const attempt = await attemptsDao.findLatestAttempt(quizId, currentUser._id);
            res.json(attempt);
        } catch (error) {
            console.error("Error fetching latest attempt:", error);
            res.status(500).json({ message: "Failed to fetch latest attempt" });
        }
    };

    const submitAttempt = async (req, res) => {
        const { quizId } = req.params;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        try {
            const quiz = await dao.findQuizById(quizId);
            if (quiz.multipleAttempts) {
                const attemptCount = await attemptsDao.countAttempts(quizId, currentUser._id);
                if (attemptCount >= quiz.howManyAttempts) {
                    return res.status(403).json({ message: "Maximum attempts reached" });
                }
            } else {
                const existingAttempt = await attemptsDao.findLatestAttempt(quizId, currentUser._id);
                if (existingAttempt) {
                    return res.status(403).json({ message: "Quiz already taken" });
                }
            }

            const attempt = {
                ...req.body,
                quiz: quizId,
                user: currentUser._id,
            };
            const newAttempt = await attemptsDao.createAttempt(attempt);
            res.json(newAttempt);
        } catch (error) {
            console.error("Error submitting attempt:", error);
            res.status(500).json({ message: "Failed to submit attempt" });
        }
    };

    app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
    app.post("/api/courses/:courseId/quizzes", createQuiz);
    app.get("/api/quizzes/:quizId", findQuizById);
    app.put("/api/quizzes/:quizId", updateQuiz);
    app.delete("/api/quizzes/:quizId", deleteQuiz);

    app.get("/api/quizzes/:quizId/attempts", findAttempts);
    app.get("/api/quizzes/:quizId/attempts/latest", findLatestAttempt);
    app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}