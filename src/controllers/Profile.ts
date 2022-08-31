import { appendFile } from "fs";
import { Request, Response, NextFunction } from "express";
import fileUpload from "express-fileupload";
import Avatar from "../models/Avatar";
import User from "../models/User";
import argon2 from "argon2";
const { cloudinary } = require("../config/cloudinary");
type UploadedFile = fileUpload.UploadedFile;

const changeAvatar = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.body;
	try {
		if (typeof req.files === "object") {
			const fileStr = req.files;
			const image: UploadedFile | UploadedFile[] = fileStr.img;
			if (
				typeof image === "object" &&
				(image as UploadedFile).name !== undefined
			) {
				const url = await cloudinary.uploader
					.upload((image as UploadedFile).tempFilePath)
					.then((result: any) => {
						return result.url;
					})
					.catch((error: any) => {
						return res.status(500).json({
							message: "failure",
							error,
						});
					});
				const response = await Avatar.findOneAndUpdate(
					{
						userId,
					},
					{
						avatar: url,
					}
				);
				if (!response) {
					const ava = new Avatar();
					ava.userId = userId;
					ava.avatar = url;
					await ava.save();
				}
				return res.status(200).json({
					msg: "Change avatar success",
				});
			}
		}
	} catch (error: any) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const getProfile = async (req: Request, res: Response) => {
	const { userId } = req.body;

	try {
		const info = await User.findById(userId);
		const avatarUser = await Avatar.findOne({
			userId,
		});
		return res.status(200).json({
			info,
			avatarUser,
		});
	} catch (error: any) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const updateProfile = async (req: Request, res: Response) => {
	const { firstName, lastName, phone, gender, userId } = req.body;

	try {
		await User.findByIdAndUpdate(userId, {
			firstName,
			lastName,
			phone,
			gender,
		});

		return res.status(200).json({
			msg: "Change profile success",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const changePassword = async (req: Request, res: Response) => {
	const { currentPassword, newPassword, confirmNewPassword, userId } = req.body;

	try {
		const user = await User.findById(userId);
		const validPassword = await argon2.verify(user.password, currentPassword);
		if (!validPassword) {
			return res.status(401).json({
				msg: "Authentication invalid",
			});
		}
		if (newPassword !== confirmNewPassword) {
			return res.status(401).json({
				msg: "Authentication invalid",
			});
		}
		const newPassw = await argon2.hash(newPassword);
		await User.findByIdAndUpdate(userId, {
			password: newPassw,
		});
		return res.status(200).json({
			msg: "Change successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export default {
	changeAvatar,
	getProfile,
	updateProfile,
	changePassword,
};
