import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TYPES = ["FLOAT", "INTEGER", "STRING", "BIT"];
const AttributeSchema = new Schema({
	deviceId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "devices",
	},
	name: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	slug: {
		type: String,
		required: true,
	},
	data_type: {
		type: String,
		enum: TYPES,
		required: true,
	},
	data_label: {
		type: String,
		required: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("attributes", AttributeSchema);
