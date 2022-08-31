import nodemailer from "nodemailer";
require("dotenv").config();
export default async (
	email: string,
	subtitle: string | undefined,
	text: string
) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 443,
			secure: true,
			auth: {
				user: "donnie.shields18@ethereal.email",
				pass: "WTA5RdYQHrb8meeqPK",
			},
		});

		transporter.sendMail(
			{
				from: process.env.USER,
				to: email,
				subject: subtitle,
				text: text,
			},
			(err, info) => {
				if (err) {
					console.log(err);
				} else {
					console.log("Message sent: " + info.response);
				}
			}
		);
		console.log("Email send successfully");
	} catch (error) {
		console.log(error);
	}
};
