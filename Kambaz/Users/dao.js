import model from "./model.js";
import { v4 as uuidv4 } from "uuid";


export default function UsersDao() {
    const createUser = (user) => {
        const newUser = {
            ...user,
            _id: uuidv4(),
            firstName: user.firstName || "New",
            lastName: user.lastName || "User",
            role: user.role || "STUDENT",
            loginId: user.loginId || `00${Date.now()}`,
            section: user.section || "S101",
            lastActivity: user.lastActivity || new Date(),
            totalActivity: user.totalActivity || "00:00:00",
        };
        return model.create(newUser);
    };


    const findAllUsers = () => model.find();
    const findUserById = (userId) => model.findById(userId);
    const findUserByUsername = (username) => model.findOne({ username: username });
    const findUserByCredentials = (username, password) => model.findOne({ username, password });
    const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
    const findUsersByRole = (role) => model.find({ role: role });

    const deleteUser = (userId) => model.deleteOne({ _id: userId });
    const findUsersByPartialName = (partialName) => {
        const regex = new RegExp(partialName, "i");
        return model.find({
            $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
        });
    };



    return {
        createUser,
        findAllUsers,
        findUserById,
        findUserByUsername,
        findUserByCredentials,
        updateUser,
        deleteUser,
        findUsersByRole,
        findUsersByPartialName
    };
}
