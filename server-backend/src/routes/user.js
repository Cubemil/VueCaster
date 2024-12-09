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
router.delete('/delete', userController.authenticate, userController.deleteUser);
router.get('/dashboard', userController.authenticate, userController.dashboard);
router.put('/change-username', userController.authenticate, userController.changeUsername);
router.put('/change-password', userController.authenticate, userController.changePassword);
router.put('/change-email', userController.authenticate, userController.changeEmail);
router.put('/change-profile-picture', userController.authenticate, userController.changeProfilePicture);
router.delete('/delete', userController.authenticate, userController.deleteUser);

// testing token validation
router.get('/validate-token', userController.authenticate, userController.validateToken);

/************************ EXPORT ROUTES ************************/

module.exports = router;
