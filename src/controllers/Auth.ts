import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { AuthHelper } from "../helpers";
import Token from "../models/Token";
import SendEmail from "../services/SendEmail";

const register = async (req: Request, res: Response) => {
	const { firstname, lastname, email, password, phone, gender } = req.body;
	try {
		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				success: false,
				message: "Email already taken",
			});
		}
		const hashedPassword = await argon2.hash(password);
		const newUser = new User({
			firstName: firstname,
			lastName: lastname,
			email: email,
			password: hashedPassword,
			phone: phone,
			gender: gender,
		});
		await newUser.save();

		const accessToken = jwt.sign(
			{
				userId: newUser._id,
			},
			process.env.ACCESS_TOKEN_SECRET || "my_secret"
		);

		return res.json({
			success: true,
			message: "User created successfully",
			accessToken,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!AuthHelper.validateEmail(email)) {
		return res.status(400).json({
			success: false,
			message: "Email is required",
		});
	}
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Incorrect email or password",
			});
		}
		const passwordValid = await argon2.verify(user.password, password);
		if (!passwordValid) {
			return res.status(400).json({
				success: false,
				message: "Incorrect username or password",
			});
		}
		const accessToken = jwt.sign(
			{
				userId: user._id,
			},
			process.env.ACCESS_TOKEN_SECRET || "my_secret"
		);
		const newToken = new Token({
			userId: user._id,
			token: accessToken,
		});
		await newToken.save();
		return res.json({
			success: true,
			message: "Login successfully",
			accessToken,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const logout = async (req: Request, res: Response) => {
	const userId = req.body.userId;
	await Token.deleteOne({ userId: userId });
	return res.json({
		success: true,
	});
};
const forgotPassword = async (req: Request, res: Response) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		console.log(user);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User with given does not exist",
			});
		}
		let newToken = await Token.findOne({ userId: user._id });
		const accessToken = jwt.sign(
			{
				userId: user._id,
			},
			process.env.ACCESS_TOKEN_SECRET || "my_secret"
		);
		if (!newToken) {
			newToken = new Token({
				userId: user._id,
				token: accessToken,
			});
			await newToken.save();
		}
		const link = `${process.env.BASE_URL}/reset/${user._id}/${newToken.token}`;
		await SendEmail(user.email, "Reset password", link);
		res.json({
			success: true,
			message: "Password reset link sent to your email account",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
const resetPasswordUser = async (req: Request, res: Response) => {
	const user = await User.findById(req.params.userId);
	if (!user) {
		return res.status(400).send({
			success: false,
			message: "Invalid link or expired",
		});
	}
	const token = await Token.findOne({
		userId: user._id,
		token: req.params.token,
	});
	if (!token) return res.status(400).json("Invalid link or expired");
	user.password = req.body.password;
	await user.save();
	await token.delete();

	res.json({
		success: true,
		message: "Password reset successfully",
	});
};
export default {
	register,
	login,
	logout,
	forgotPassword,
	resetPasswordUser,
};
