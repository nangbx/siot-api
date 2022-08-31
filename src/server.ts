import express, { Application, Request, Response } from "express";
require("dotenv").config();
import DB from "./config/connectDb";
import { AuthRouter, DeviceRouter, SlugRouter, ProfileRouter } from "./routes";
import cors from "cors";
import fileUpload from "express-fileupload";
const app: Application = express();
const DB_USERNAME: string = process.env.DB_USERNAME || "nh3";
const DB_PASSWORD: string = process.env.DB_PASSWORD || "1234";
const PORT = process.env.PORT || 8080;

const db: DB = new DB(DB_USERNAME, DB_PASSWORD);
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(express.urlencoded({ extended: true }));

db.connect();
AuthRouter(app);
DeviceRouter(app);
SlugRouter(app);
ProfileRouter(app);
app.get("/", (req: Request, res: Response) => {
	res.send("Hello world!");
});

app.listen(PORT, () => {
	console.log("Server is running on port: " + PORT);
});
