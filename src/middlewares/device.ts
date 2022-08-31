import { Request, Response, NextFunction } from "express";
import Attribute from "../models/Attribute";
import Device from "../models/Device";

async function verify(req: Request, res: Response, next: NextFunction) {
	const { device, attribute } = req.params;
	const { userId } = req.body;
	req.body.device = await Device.findOne({
		slug: device,
		user: userId,
	});
	req.body.attribute = await Attribute.findOne({
		slug: attribute,
	});
	next();
}
async function verifySlug(req: Request, res: Response, next: NextFunction) {
	const { device } = req.params;
	const { userId, attribute } = req.body;
	req.body.deviceCheck = await Device.findOne({ device, userId });
	req.body.attributeCheck = await Attribute.findOne({
		slug: attribute,
	});
	next();
}
export default {
	verify,
	verifySlug,
};
