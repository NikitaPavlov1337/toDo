/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Doings from '../models/Doings.js';
import Files from '../models/Files.js';
import logger from '../logger/logger.js';
import config from '../config/config.js';

/**
 * Generate AccessToken.
 * @param {number} id - The id of user in User's collection.
 * @param {string} username - The username of user, from User's collection.
 * @return {string} token - which generated jwt.
 */
const generateAccessToken = (id, username) => {
	const payload = {
		userId: id,
		userName: username

	};
	return jwt.sign(payload, config.get('token.secretKey'), { expiresIn: '3h' });
};

/**
 * @class Controller
	* handling all req and res operations on back-end
 */
class Controller {
	async registration(req, res) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Ошибка при регистрации', errors });
			}
			const { username, password } = req.body;
			const checkUser = await User.findOne({ username });
			if (checkUser) {
				return res.status(409).json({ message: 'Такой пользователь существует' });
			}
			bcrypt.hash(password, 6, async (err, hash) => {
				try {
					await new User({ username, password: hash }).save();
					return res.status(201).json({ message: 'Пользователь успешно зарегистрирован ' });
				} catch (e) {
					return res.json({ message: 'Ошибка', err });
				}
			});
		} catch (error) {
			logger.error(error);
			res.status(400).json({ message: 'Registration error' });
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body;
			const user = await User.findOne({ username });
			if (!user) {
				return res.status(404).json({ message: `Пользователь ${username} не найден` });
			}
			const validPasword = bcrypt.compareSync(password, user.password);
			if (!validPasword) {
				return res.status(401).json({ message: `Указан неправильный пароль: ${validPasword}` });
			}
			const token = generateAccessToken(user._id, user.username);
			return res.status(200).json({ token: `Bearer ${token}` });
		} catch (error) {
			logger.error(error);
		}
	}

	async getDoings(req, res) {
		const { userId } = req.user;
		if (!userId) {
			res.status(401).json({ message: 'Что бы увидеть список своих дела, Вы должны быть зарегистрированы :)' });
		} else {
			const userDoings = await Doings.find({ user: userId });
			return res.status(200).json({ message: userDoings });
		}
	}

	async getDoingbyTittle(req, res) {
		const { tittleSelect } = req.query;
		const { userId } = req.user;
		const userDoings = await Doings.find({ user: userId, tittle: tittleSelect });
		return res.status(200).json({ message: userDoings });
	}

	async postDoings(req, res) {
		const { tittle, description, date } = req.body;
		const { userId, userName } = req.user;
		if (!userId) {
			res.status(401).json({ message: 'Что бы добавить список дел, Вы должны быть зарегистрированы :)' });
		} else {
			const userDoings = await Doings({ tittle, description, date, user: userId, username: userName }).save();
			return res.status(200).json({ message: userDoings });
		}
	}

	async updateDoings(req, res) {
		const { idDoing, tittle, description, date } = req.body;
		const userDoings = await Doings.findOneAndUpdate({ _id: idDoing }, { tittle, description, date });
		return res.status(200).json({ message: userDoings });
	}

	async deleteDoings(req, res) {
		const { idDoing } = req.body;
		const userDoings = await Doings.findOneAndDelete({ _id: idDoing });
		return res.status(200).json({ message: userDoings });
	}

	async uploadDoings(req, res) {
		try {
			if (!req.files) {
				res.status(400).json({ message: 'Фаил не был отправлен' });
			}
			const { userId, userName } = req.user;
			const file = req.files.fileName;
			const path = `./static/${userName}/${file.name}`;
			file.mv(path);
			const userFile = await Files({ filename: file.name, path, user: userId, username: userName }).save();
			return res.status(200).json({ message: `Фаил добавлен: ${userFile}` });
		} catch (error) {
			return res.status(400).json({ message: 'Запрос на добавления файла не обработан, повторите запрос' });
		}
	}

	async downloadDoings(req, res) {
		try {
			const { filename } = req.query;
			const { userId } = req.user;
			const userFile = await Files.find({ user: userId, filename });
			const { path } = userFile[0];
			return res.status(200).download(path);
		} catch (error) {
			return res.status(400).json({ message: 'Запрос на скачивание файла не обработан, повторите запрос' });
		}
	}
}

export default new Controller();
