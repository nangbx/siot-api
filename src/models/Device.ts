import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	imgUrl: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	slug: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	attributes: [
		{
			type: Schema.Types.ObjectId,
			ref: "attributes",
		},
	],
});
export default mongoose.model("devices", DeviceSchema);
