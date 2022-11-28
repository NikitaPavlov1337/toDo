/* eslint-disable import/extensions */
/**
 * Main module in charge of start application , db connection and set additional settings (middleware) like cors, parse json.
 * @module './router/router.js'
 */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/config.js';
import logger from './logger/logger.js';
import router from './router/router.js';

const app = express();

app.use(express.json());
app.use(cors({
	origin: ['http://localhost:3001'],
	credentials: true
}));
app.use('/auth', router);

async function startApp() {
	try {
		await mongoose.connect(config.get('mongo.url', { useUnifiedTopology: true }))
			.then(() => logger.info('MongoDB connected'))
			.catch((error) => logger.error(error));
		app.listen(config.get('server.port'), () => {
			logger.info('Server up');
		});
	} catch (e) {
		logger.error(e);
	}
}

startApp();
