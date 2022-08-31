import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AvatarSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "users",
	},
	avatar: {
		type: String,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("avatar", AvatarSchema);
