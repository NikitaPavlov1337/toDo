/**
 * Module representing the document of MongoDB
 * There are placed users's file data

 * @module '../models/Files.js'
 * @type {model}
 */

import { Schema, model } from 'mongoose';

const filesSchema = new Schema({
	filename: { type: String, required: true },
	path: { type: String, required: true },
	date: { type: Date, default: Date.now },
	user: { ref: 'User', type: Schema.Types.ObjectId },
	username: { ref: 'User', type: Schema.Types.String }

});

export default model('Files', filesSchema);
