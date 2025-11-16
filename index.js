import express from 'express';
import Hello from "./Hello.js"
import Lab5 from './Lab5/index.js';
import cors from "cors";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import "dotenv/config";
import session from "express-session";
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000" || "https://fa25-kambaz-next-js-git-a5-abhijiths-projects-7705a139.vercel.app",
})
);
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.SERVER_URL,
    };
}
app.use(session(sessionOptions));

app.use(express.json());
UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);

Hello(app);
Lab5(app);
app.listen(process.env.PORT || 4000)
