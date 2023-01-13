import express from "express";
import userRouter from "./user";
import authMiddleware from "../middlewares/auth";

const v1Router = express.Router();

v1Router.use(authMiddleware);
v1Router.use("/user", userRouter);

export default v1Router;
