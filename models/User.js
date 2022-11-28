/**
 * Module representing the document of MongoDB
 * There are placed users data

 * @module '../models/User.js'
 * @type {model}
 */

import { Schema, model } from 'mongoose';

const User = new Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true }
});

export default model('User', User);
