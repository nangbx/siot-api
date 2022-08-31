import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AttributeValueNumberSchema = new Schema({
	value: {
		type: Number,
		required: true,
	},
	attributedId: {
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
	attribute: {
		type: Schema.Types.ObjectId,
		ref: "attributes",
	},
});

const AttributeValueStringSchema = new Schema({
	value: {
		type: Number,
		required: true,
	},
	attributedId: {
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
	attribute: {
		type: Schema.Types.ObjectId,
		ref: "attributes",
	},
});

export default {
	AttributeNumber: mongoose.model(
		"attributeValueInteger",
		AttributeValueNumberSchema
	),
	AttributeString: mongoose.model(
		"attributeValueStringSchema",
		AttributeValueStringSchema
	),
};
