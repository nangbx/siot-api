import mongoose from "mongoose";

class DB {
	private username: string;
	private password: string;
	constructor(_username: string, _password: string) {
		this.username = _username;
		this.password = _password;
	}
	public connect = async () => {
		try {
			await mongoose.connect(
				`mongodb+srv://${this.username}:${this.password}@mern-project.mgrfv.mongodb.net/mern-project?retryWrites=true&w=majority`
			);
			console.log("MongoDb connected");
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	};
}
export default DB;
