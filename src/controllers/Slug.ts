import express, { Response, Request } from "express";
import { DeviceController } from ".";
import slugify from "slugify";
const verifySlugExist = async (req: Request, res: Response) => {
	try {
		const { name } = req.body;
		let verify = !(await DeviceController.verifySlugExist(name));
		res.json({
			verify,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const suggestSlug = async (req: Request, res: Response) => {
	try {
		const { name } = req.body;
		const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		let slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }) + "-";
		while (true) {
			for (let i = 0; i < 5; i++) {
				slug += chars.charAt(Math.floor(Math.random() * chars.length));
			}

			const isExist = await DeviceController.verifySlugExist(slug);
			if (!isExist) {
				return res.json({
					slug,
				});
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
export default {
	verifySlugExist,
	suggestSlug,
};
