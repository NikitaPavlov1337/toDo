/* eslint-disable import/extensions */
/**
 * Router module in charge of routing , middleware and controller .
 * @module './router/router.js'
 */

import { Router } from 'express';
import { check } from 'express-validator';
import fileUpload from 'express-fileupload';
import controller from '../controller/controller.js';
import middlewaree from '../middlewaree/middlewaree.js';

const router = new Router();

router.post('/reg', [check('username', 'Имя пользователя не может быть пустым').notEmpty(),
	check('password', 'Пароль должен быть больше 6 символов').isLength({ min: 6 })
], controller.registration);
router.post('/login', controller.login);
router.post('/doings', middlewaree, controller.postDoings);
router.get('/doings', middlewaree, controller.getDoings);
router.get('/doings/tittle', middlewaree, controller.getDoingbyTittle);
router.put('/doings', middlewaree, controller.updateDoings);
router.delete('/doings', middlewaree, controller.deleteDoings);
router.post('/uploadDoings', [middlewaree, fileUpload({ createParentPath: true })], controller.uploadDoings);
router.get('/downloadDoings/filename', middlewaree, controller.downloadDoings);

export default router;
