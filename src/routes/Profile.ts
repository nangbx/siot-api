import express, { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
import { Application } from "express";
import { ProfileController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = express.Router();

export default (app: Application) => {
	app.use("/api/user", router);

	// Change avatar
	router.post(
		"/change/avatar",
		AuthMiddleware.verifyToken,
		ProfileController.changeAvatar
	);

	// Get profile
	router.get(
		"/profile",
		AuthMiddleware.verifyToken,
		ProfileController.getProfile
	);

	// Change profile
	router.put(
		"/profile/change",
		AuthMiddleware.verifyToken,
		ProfileController.updateProfile
	);

	// Change password

	router.put(
		"/profile/password/change",
		AuthMiddleware.verifyToken,
		ProfileController.changePassword
	);
};
