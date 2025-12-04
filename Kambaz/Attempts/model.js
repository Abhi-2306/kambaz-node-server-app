import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("AttemptsModel", schema);
export default model;