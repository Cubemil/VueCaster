const { User, TokenBlacklist, FailedLogins } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

/************************ ENVIRONMENT VARIABLES AND HELPER FUNCTIONS ************************/

// fetch jwt secret key and token exp. time from env variables (note: not added to git)
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_HOURS = process.env.TOKEN_EXPIRATION_HOURS || 1;
const TOKEN_EXPIRATION_MS = process.env.TOKEN_EXPIRATION_MS || 3600000;

/**
 * Hashes a given password using bcrypt with a salt rounds value of 10.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
};

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {boolean} - Returns true if the passwords match, otherwise false.
 */
const comparePassword = (password, hashedPassword) => {
  // ORIGINAL: return await bcrypt.compare(password, hashedPassword);
  return bcrypt.compareSync(password, hashedPassword);
};

/**
 * Generates a JSON Web Token (JWT) for the given user data.
 *
 * @param {Object} data - The user data to include in the token.
 * @param {string} data.userId - The unique identifier for the user.
 * @param {string} data.username - The username of the user.
 * @param {string} data.email - The email address of the user.
 * @returns {Promise<string>} A promise that resolves to the generated JWT.
 */
const generateToken = async (data) => {
  const user = {
    userId: data.userId,
    username: data.username,
    email: data.email,
  }
  return jwt.sign({ user }, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRATION_HOURS}h` }); 
};

/************************ JWT AUTHENTICATION MIDDLEWARE ************************/

/**
 * Middleware to authenticate a user based on the Authorization header.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.header - The headers of the request.
 * @param {Object} req.body - The body of the request.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * 
 * @returns {void}
 * 
 * @throws {Error} If the Authorization header is missing or malformed.
 * @throws {Error} If the token has been invalidated.
 * @throws {Error} If the user is not authorized to access the resource.
*/
// POST /user/authenticate
const authenticate = async (req, res, next) => {
  try {
    // get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ error: 'Authorization header missing or malformed' });
    }
    const token = authHeader.replace('Bearer ', '');

    const isTokenBlacklisted = await TokenBlacklist.findOne({ where: { token } });
    if (isTokenBlacklisted)
      return res.status(401).send({ error: 'Token has been invalidated' });

    // decoded from token and put as request body
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.user;

    console.log("Auththenticate middleware called, data:");
    console.log("authHeader: ", authHeader);
    console.log("req.body: ", req.body);
    console.log("decoded: ", decoded);
    console.log("req.user: ", req.user);

    // call actual request handler after
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' }); 
  }
};

/************************ HTTP REQUEST HANDLERS ************************/

/**
 * Handles user signup.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
// POST /user/signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    logger.warn('Signup attempt with missing fields', { username, email });
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const hashedPassword = await hashPassword(password);

    //TODO later dont return user only msg
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    logger.info('User created successfully', {
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email
    });

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      logger.warn('Signup failed: Username or email already exists', { username, email });
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    logger.error('Error creating user', { error: error.message });
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

/**
 * Authenticates a user and handles the login process.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.emailOrUsername - User's email or username
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Promise<void>} A promise that resolves when the login process is complete
 * @throws {Error} When there's an error during the login process
 * 
 * @description
 * This function handles user authentication by:
 * 1. Validating if the input is an email or username
 * 2. Checking if the user exists
 * 3. Verifying if the account is locked due to too many attempts
 * 4. Validating the password
 * 5. Resetting login attempts on successful login
 * 6. Generating and returning a JWT token
 */
// POST /user/login
const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmail = emailRegex.test(emailOrUsername)
  const whereClause = isEmail ? { email: emailOrUsername } : { username: emailOrUsername }

  try {
    const user = await User.findOne({ where: whereClause });

    if (!user) {
      logger.warn('User not found when logging in', { emailOrUsername });
      return handleFailedUnknownCredentialsLogin(emailOrUsername, res);
    }

    const now = new Date();
    if (user.lockedUntil && user.lockedUntil > now) {
      const secondsLeft = Math.ceil((user.lockedUntil - now) / 1000);
      logger.warn('User account locked due to too many login attempts', { emailOrUsername });
      return res.status(401).json({ message: `Too many login attempts. Please try again in ${secondsLeft} seconds.` });
    }

    if (!comparePassword(password, user.password)) {
      logger.warn('Incorrect password when logging in', { emailOrUsername });
      return handleFailedUserLogin(user, res);
    }

    user.loginAttempts = 0;
    user.lockedUntil = null;
    await user.save();

    const token = await generateToken(user);
    logger.info('User logged in successfully', { userId: user.userId, username: user.username });
    res.status(200).json({ message: 'Login successful', token, username: user.username });
  } catch (error) {
    logger.error('Error logging in', { error: error.message });
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
};

/**
 * Fetches the profile of a user by their userId.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.userId - The ID of the user to fetch.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
// GET /user/:userId/profile
const profile = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['username']
    });
    if (!user) {
      logger.warn('User not found when fetching profile', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('User profile fetched successfully', { userId: user.userId, username: user.username });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user profile', error: error.message });
  }
};

/********************* Authenticated User Routes **********************/

/**
 * Fetches the dashboard data for the authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object attached to the request.
 * @param {string} req.user.userId - The ID of the authenticated user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
// GET /user/dashboard
const dashboard = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      logger.warn('User not found when fetching dashboard', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('User dashboard fetched successfully', { userId: user.userId, username: user.username });
    res.status(200).json({ message: 'User dashboard fetched successfully', user });
  } catch (error) {
    logger.error('Error fetching user dashboard', { error: error.message });
    res.status(400).json({ message: 'Error sending user dashboard', error: error.message });
  }
};

/**
 * Change the username of a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object attached to the request.
 * @param {string} req.user.userId - The ID of the user.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.password - The current password of the user.
 * @param {string} req.body.newUsername - The new username to be set.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the username is changed.
 */
// PUT /user/change-username
const changeUsername = async (req, res) => {
  const { userId } = req.user;
  const { password, newUsername } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      logger.warn('User not found when updating username', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = comparePassword(password, user.password);
    if (!passwordMatch) {
      logger.warn('Password is not correct when updating username', { userId });
      return res.status(401).json({ message: 'Password is not correct' });
    }

    user.username = newUsername;
    
    await user.save();
    logger.info('Username updated successfully', { userId: user.userId, username: user.username });
    res.status(200).json({ message: 'Username updated successfully', user });
  } catch (error) {
    logger.error('Error updating username', { error: error.message });
    res.status(400).json({ message: 'Error updating username', error: error.message });
  }
}

/**
 * Change the password for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object attached to the request.
 * @param {string} req.user.userId - The ID of the user.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.password - The current password of the user.
 * @param {string} req.body.newPassword - The new password to be set.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
// PUT /user/change-password
const changePassword = async (req, res) => {
  const { userId } = req.user;
  const { password, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      logger.warn('User not found when updating password', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = comparePassword(password, user.password);
    if (!passwordMatch) {
      logger.warn('Current password is not correct when updating password', { userId });
      return res.status(401).json({ message: 'Current Password is not correct' });
    }
    
    user.password = await hashPassword(newPassword);
    await user.save();
    res.status(200).json({ message: 'Password updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating password', error: error.message });
  }
};

/**
 * Change the email address of a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object attached to the request.
 * @param {string} req.user.userId - The ID of the user.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.password - The current password of the user.
 * @param {string} req.body.newEmail - The new email address to be set.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the email is changed.
 */
// PUT /user/change-email
const changeEmail = async (req, res) => {
  const { userId } = req.user;
  const { password, newEmail } = req.body;

  console.log("changeEmail called, data:");
  console.log("userId: ", userId);
  console.log("password: ", password);
  console.log("newEmail: ", newEmail);
  
  if (!newEmail) {
    logger.warn('No email provided when updating email', { userId });
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!password) {
    logger.warn('No password provided when updating email', { userId });
    return res.status(400).json({ message: 'Password is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!newEmail.match(emailRegex)) {
    logger.warn('Invalid email format when updating email', { userId });
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      logger.warn('User not found when updating email', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = comparePassword(password, user.password);
    if (!passwordMatch) {
      logger.warn('Password is not correct when updating email', { userId });
      return res.status(401).json({ message: 'Password is not correct' });
    }

    user.email = newEmail;
    
    await user.save();
    logger.info('Email updated successfully', { userId: user.userId, email: user.email });
    res.status(200).json({ message: 'Email updated successfully', user });
  } catch (error) {
    logger.error('Error updating email', { error: error.message });
    res.status(400).json({ message: 'Error updating email', error: error.message });
  }
};

/**
 * Updates a user's profile picture URL in the database
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - ID of the authenticated user
 * @param {Object} req.body - Request body
 * @param {string} req.body.profilePictureUrl - New profile picture URL
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with success/error message and updated user data
 * @throws {Error} If user is not found or update fails
 */
// PUT /user/change-profile-picture
const changeProfilePicture = async (req, res) => {
  const { userId } = req.user.userId;
  const { profilePictureUrl } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      logger.warn('User not found when updating profile picture', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    if (profilePictureUrl) user.profilePictureUrl = profilePictureUrl;
    
    await user.save();
    logger.info('Profile picture updated successfully', { userId: user.userId, profilePictureUrl: user.profilePictureUrl });
    res.status(200).json({ message: 'Profile picture updated successfully', user });
  } catch (error) {
    logger.error('Error updating profile picture', { error: error.message });
    res.status(400).json({ message: 'Error updating profile picture', error: error.message });
  }
};

/**
 * Deletes a user account after verifying credentials and confirmation.
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - ID of the authenticated user
 * @param {Object} req.body - Request body
 * @param {string} req.body.password - User's password for verification
 * @param {string} req.body.confirmation - Confirmation text that must match 'Delete Account'
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with status and message
 * @throws {Error} When database operations fail
 */
// DELETE /user/delete
const deleteUser = async (req, res) => {
  const { userId } = req.user;
  const { password, confirmation } = req.body;

  if (!password || !confirmation) {
    logger.warn('Password or confirmation missing when deleting account', { userId });
    return res.status(400).json({ message: 'Password and confirmation are required' });
  }

  if (confirmation !== 'Delete Account') {
    logger.warn('Confirmation text does not match when deleting account', { userId });
    return res.status(400).json({ message: 'Confirmation text does not match' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      logger.warn('User not found when deleting account', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = comparePassword(password, user.password);
    if (!passwordMatch) {
      logger.warn('Password is not correct when deleting account', { userId });
      return res.status(401).json({ message: 'Password is not correct' });
    }

    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    if (token) {
      await TokenBlacklist.create({
        token,
        userId,
        reason: 'User deleted account',
        expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_MS) // natural expiration
      });
    }

    await user.destroy();
    logger.info('User account deleted successfully', { userId });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user', { error: error.message });
    res.status(400).json({ message: 'Error deleting user', error: error.message });
  }
};

/************************ JWT TOKEN VALIDATION ************************/

/**
 * ***For Testing purposes only***
 * 
 * Validates the authentication token and returns user information
 * @param {Object} req - Express request object containing the user information in req.user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with validation message and user data
 */
// GET /user/validate-token
const validateToken = async (req, res) => {
  const { user } = req.user;
  logger.info('Validation of token successful', { userId: user.userId, username: user.username });
  res.status(200).json({ message: 'Token is valid', user });
};

/************************ HELPER FUNCTIONS ************************/

/**
 * Handles failed login attempts for unknown credentials by managing attempt counts and implementing lockout periods.
 * 
 * @param {string} identifier - The identifier (email/username) used in the login attempt
 * @param {Object} res - Express response object
 * @param {Function} res.status - Function to set HTTP status code
 * @param {Function} res.json - Function to send JSON response
 * @returns {Object} Returns a 401 status response with appropriate error message
 * 
 * @description
 * - Creates a new record for first-time failed attempts
 * - Tracks number of failed attempts per identifier
 * - Implements a 30-second lockout after 5 failed attempts
 * - Provides remaining lockout time in the error message when applicable
 * 
 * @throws {Error} May throw database-related errors during create/save operations
 */
async function handleFailedUnknownCredentialsLogin(identifier, res) {
  const now = new Date();
  let record = await FailedLogins.findOne({ where: { identifier } });

  if (record && record.lockedUntil && record.lockedUntil <= now) {
    record.failedLogins = 0;
    record.lockedUntil = null;
    await record.save();
  }

  if (!record) {
    record = await FailedLogins.create({
      identifier,
      failedLogins: 1,
      lockedUntil: null
    });
    logger.warn('Unknown user login attempt with new identifier', { identifier });
    return res.status(401).json({ message: 'Invalid credentials or password' });
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    const secondsLeft = Math.ceil((record.lockedUntil - now) / 1000);
    return res.status(401).json({ message: `Too many login attempts. Please try again in ${secondsLeft} seconds.` });
  }

  record.failedLogins++;

  if (record.failedLogins >= 5) {
    record.lockedUntil = new Date(now.getTime() + 30000); // 30 sec lock
    await record.save();
    const secondsLeft = Math.ceil((record.lockedUntil - now) / 1000);
    return res.status(401).json({ message: `Too many login attempts. Please try again in ${secondsLeft} seconds.` });
  }

  await record.save();
  logger.warn('Unknown user login attempt', { identifier });
  return res.status(401).json({ message: 'Invalid credentials or password' });
}

/**
 * Handles failed user login attempts by updating login attempts counter and implementing lockout functionality
 * @param {Object} user - The user object from the database
 * @param {Object} res - Express response object
 * @returns {Object} Returns HTTP 401 response with appropriate error message
 * @async
 * @throws {Error} If saving user to database fails
 */
async function handleFailedUserLogin(user, res) {
  const now = new Date();

  if (user.lockedUntil && user.lockedUntil <= now) {
    user.loginAttempts = 0;
    user.lockedUntil = null;
    await user.save();
  }

  user.loginAttempts++;

  if (user.loginAttempts >= 5) {
    user.lockedUntil = new Date(now.getTime() + 30000); // 30 sec lock
    await user.save();
    const secondsLeft = Math.ceil((user.lockedUntil - now) / 1000);
    logger.warn('User account locked due to too many login attempts', { userId: user.userId });
    return res.status(401).json({ message: `Too many login attempts. Please try again in ${secondsLeft} seconds.` });
  }

  await user.save();
  logger.warn('Incorrect password when logging in', { userId: user.userId });
  return res.status(401).json({ message: 'Invalid credentials or password. Please try again.' });
}

/************************ EXPORT CONTROLLERS ************************/

module.exports = {
  signup,
  login,
  profile,
  dashboard,
  changeUsername,
  changePassword,
  changeEmail,
  changeProfilePicture,
  deleteUser,
  authenticate,
  validateToken
};
