import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Attribute from "../models/Attribute";
import AttributeValue from "../models/AttributeValue";
import Device from "../models/Device";
import User from "../models/User";

const getDevicesByUser = async (req: Request, res: Response) => {
	try {
		const { userId } = req.body;
		const devices = await Device.find({ user: userId });
		res.json({
			success: true,
			devices,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const getDeviceBySlugName = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { slug } = req.params;
	const { userId } = req.body;

	try {
		const device = await Device.find({ slug, user: userId });
		if (!device) {
			res.status(400).json({
				success: false,
				message: "Not found",
			});
		} else {
			res.json({
				success: true,
				device,
			});
		}
		req.body.device = device;
		return next();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const getAttributeOfDevice = async (req: Request, res: Response) => {
	const { slug } = req.params;
	const { userId } = req.body;
	try {
		const device = await Device.findOne({ slug, user: userId });
		const attributes = await Attribute.find({ deviceId: device._id });
		return res.status(200).json({
			success: true,
			attributes,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Add new attributes
const newAttribute = async (req: Request, res: Response) => {
	const { slugDevice } = req.params;
	const { name, slug, data_label, data_type, userId } = req.body;
	try {
		const device = await Device.findOne({ slugDevice, user: userId });
		const newAttribute = new Attribute({
			deviceId: device._id,
			name: name,
			slug: slug,
			data_type: data_type,
			data_label: data_label,
		});
		await newAttribute.save();
		return res.status(200).json({
			msg: "Add successfully",
			data: newAttribute,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Attri: deviceID, name, createdAt, slug, data_type, data_label

const save = async (req: Request, res: Response) => {
	const { name, imgUrl, attributes, slug, userId } = req.body;
	// if(verigy ...)

	try {
		const newDevice = new Device({
			name,
			imgUrl,
			slug,
			user: userId,
		});
		await newDevice.save();

		await attributes.map((attr: any) => {
			const newAttr = new Attribute({
				deviceId: newDevice._id,
				name: attr.name,
				slug: attr.slug,
				data_type: attr.data_type,
				data_label: attr.data_label,
			});
			newAttr.save();
		});
		res.json({
			success: true,
			device: newDevice,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const verifySlugExist = async (slug: String) => {
	const device = await Device.findOne({ slug });
	return !!device;
};

const saveDeviceValue = async (req: Request, res: Response) => {
	const { device, attribute, userId, value } = req.body;
	console.log(device);
	try {
		if (!device || !attribute || !userId) {
			return res.status(400).json({
				success: false,
				message: "Failed to authenticate user",
			});
		}

		if (attribute.data_type === "FLOAT" || attribute.data_type === "INTERGER") {
			const insertData = new AttributeValue.AttributeNumber({
				value: value,
				attributedId: attribute._id,
			});
			await insertData.save();
			return res.status(200).json({
				success: true,
				message: insertData,
			});
		} else {
			const insertData = new AttributeValue.AttributeString({
				value: value,
				attributedId: attribute._id,
			});
			await insertData.save();
			return res.status(200).json({
				success: true,
				message: insertData,
			});
		}
	} catch (error: any) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const getDeviceValue = async (req: Request, res: Response) => {
	const { device, attribute, userId } = req.body;
	const { from, to } = req.query;
	console.log(from);
	try {
		if (!device || !attribute || !userId) {
			return res.status(400).json({
				success: false,
				message: "Failed to authenticate user",
			});
		}
		const { _id, data_type } = attribute;
		console.log(_id);
		if (attribute.data_type === "FLOAT" || attribute.data_type === "INTERGER") {
			const data = await AttributeValue.AttributeNumber.find({
				attributedId: _id,
				updatedAt: { $gt: from, $lt: to },
			});
			console.log(data);
			return res.status(200).json({
				data,
			});
		} else {
			const data = await AttributeValue.AttributeString.find({
				attributedId: _id,
				updatedAt: { $gt: from, $lt: to },
			});
			console.log(data);
			return res.status(200).json({
				data,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const deleteDevice = async (req: Request, res: Response) => {
	try {
		const { slug } = req.params;
		const device = await Device.findOne({
			slug: slug,
		});
		if (!device) {
			return res.status(400).json({
				msg: "Invalid device",
			});
		}
		await Device.findByIdAndRemove(device._id);
		return res.status(200).json({
			msg: "Success",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};
export default {
	getDevicesByUser,
	save,
	verifySlugExist,
	getDeviceBySlugName,
	newAttribute,
	getAttributeOfDevice,
	saveDeviceValue,
	getDeviceValue,
	deleteDevice,
};
