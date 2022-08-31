import express, { Application } from "express";
import { SlugController } from "../controllers";
const router = express.Router();

export default (app: Application) => {
	app.use("/api/slug", router);

	router.post("/suggest", SlugController.suggestSlug);
	router.post("/verify", SlugController.verifySlugExist);
};
