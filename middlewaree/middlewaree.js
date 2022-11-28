import jwt from 'jsonwebtoken';
import logger from '../logger/logger.js';
import config from '../config/config.js';

/**
 * Represents a middlewaree for checking authorization of user.

 * @param {object} req - Request from Client.
 * @property {object} user - user this is object with keys: userId and userName, its added to each request passed with authorization

 * @param {object} res - Response from Server to Client.
 * @param next - Its function forwarding to next middlewaree
 */

export default function (req, res, next) {
	if (req.method === 'OPTIONS') {
		next();
	}

	try {
	/**
     * Get the token value.
     * @return {string} token this is token of client placed in request headers in authorization key.
     */
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			return res.status(403).json({ message: 'Пользователь не авторизован' });
		}
		/**
     * Get the decoded Token after verification user password.
     * @return {object} token this is token of client placed in request headers in authorization key.
     */
		const decodeToken = jwt.verify(token, config.get('token.secretKey'));
		/**
     * Add object (decodeToken) with information of user ( userId, userName) to request.
					* @user - user this is object with keys: userId and userName, its added to each request passed with authorization
     */
		req.user = decodeToken;
		next();
	} catch (error) {
		logger.error(error);
		return res.status(403).json({ message: 'Пользователь не авторизован' });
	}
}
