import express, { Application, Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = express.Router();

export default (app: Application) => {
	app.use("/api/auth", router);

	// Register
	router.post("/register", AuthController.register);
	// Login
	router.post("/login", AuthController.login);
	// Logout
	router.get("/logout", AuthMiddleware.verifyToken, AuthController.logout);
	// Reset password
	router.post("/reset", AuthController.forgotPassword);
	router.post("/reset/:userId/:token", AuthController.resetPasswordUser);
};
