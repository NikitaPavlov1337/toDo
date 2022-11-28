/**
 * Module representing the document of MongoDB
	* There are placed the data about user's doings

 * @module '../models/Doings.js'
 * @type {model}
 */

import { Schema, model } from 'mongoose';

const doingsSchema = new Schema({
	tittle: { type: String, required: true },
	description: { type: String, required: true },
	date: { type: Date, default: Date.now },
	user: { ref: 'User', type: Schema.Types.ObjectId },
	username: { ref: 'User', type: Schema.Types.String }

});

export default model('Doings', doingsSchema);
