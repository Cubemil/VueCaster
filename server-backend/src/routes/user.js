/************************ ROUTER SETUP ************************/

const express = require('express');
const router = express.Router();

/************************ IMPORT CONTROLLERS ************************/

const userController = require('../controllers/user');

/************************ HTTP USER ROUTE HANDLERS ************************/

// public router: no auth required
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/:userId/profile', userController.profile);

// protected router: auth required
router.put('/update', userController.authenticate, userController.updateUser);
router.delete('/delete', userController.authenticate, userController.deleteUser);
router.get('/dashboard', userController.authenticate, userController.dashboard);

// testing token validation
router.get('/validate-token', userController.authenticate, userController.validateToken);

/************************ EXPORT ROUTES ************************/

module.exports = router;
