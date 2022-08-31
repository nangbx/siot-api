import express, { Application, Response, Request } from "express";
import { DeviceController } from "../controllers";
import { AuthMiddleware, DeviceMiddleware } from "../middlewares";
const router = express.Router();
export default (app: Application) => {
	app.use("/api/devices", router);

	// Get devices by user
	router.get(
		"/",
		AuthMiddleware.verifyToken,
		DeviceController.getDevicesByUser
	);

	// Get device by slug
	router.get(
		"/:slug",
		AuthMiddleware.verifyToken,
		DeviceController.getDeviceBySlugName
	);

	// Get attribute device
	router.get(
		"/:slug/attr",
		AuthMiddleware.verifyToken,
		DeviceController.getAttributeOfDevice
	);

	// Delete device by slug name

	router.delete(
		"/:slug",
		AuthMiddleware.verifyToken,
		DeviceController.deleteDevice
	);

	// Add new device
	router.post("/", AuthMiddleware.verifyToken, DeviceController.save);

	// Add new attribute
	router.post(
		"/:slugDevice/new",
		AuthMiddleware.verifyToken,
		DeviceMiddleware.verifySlug,
		DeviceController.newAttribute
	);

	// Post data
	router.post(
		"/:device/attributes/:attribute",
		AuthMiddleware.deviceAuth,
		DeviceMiddleware.verify,
		DeviceController.saveDeviceValue
	);

	// Get data
	router.get(
		"/:device/attributes/:attribute/filter",
		AuthMiddleware.deviceAuth,
		DeviceMiddleware.verify,
		DeviceController.getDeviceValue
	);
};
