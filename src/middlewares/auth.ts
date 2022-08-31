import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.header("Authorization");
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Access token not found",
		});
	}
	try {
		const decoded = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET || "my_secret"
		) as { userId: string };
		req.body.userId = decoded.userId;
		next();
	} catch (error) {
		console.log(error);
		return res.status(403).json({
			success: false,
			message: "Invalid token",
		});
	}
};

const deviceAuth = async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;
	console.log(authorization);
	if (!authorization) {
		return res.status(401).json({
			success: false,
			message: "Unauthenticated",
		});
	}

	try {
		const token = authorization && authorization.split(" ")[1];
		const result = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET || "my_secret"
		) as { userId: string };
		req.body.userId = result.userId;
		next();
	} catch (error: any) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};
export default {
	verifyToken,
	deviceAuth,
};
