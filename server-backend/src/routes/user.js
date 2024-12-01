/************************ ROUTER SETUP ************************/

const express = require('express');
const router = express.Router();

/************************ IMPORT CONTROLLERS ************************/

const userController = require('../controllers/user');

/************************ HTTP ROUTE HANDLERS ************************/

// public router: no auth required
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/:userId/profile', userController.profile);

// protected router: auth required
router.get('/validateToken', userController.authenticateToken, userController.validateToken); // test route
router.put('/update', userController.authenticateToken, userController.updateUser);
router.delete('/delete', userController.authenticateToken, userController.deleteUser);

/************************ EXPORT ROUTES ************************/

module.exports = router;
