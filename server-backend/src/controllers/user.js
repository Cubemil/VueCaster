const User = require('../models/user');
const TokenBlacklist = require('../models/tokenBlacklist');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/************************ ENVIRONMENT VARIABLES AND HELPER FUNCTIONS ************************/

// fetch jwt secret key and token exp. time from env variables (note: not added to git)
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_HOURS = process.env.JWT_SECRET || 1;
const TOKEN_EXPIRATION_MS = process.env.TOKEN_EXPIRATION_MS || 3600000;

// hashes password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
};

// checks if password is correct
const comparePassword = async (password, hashedPassword) => {
  // ORIGINAL: return await bcrypt.compare(password, hashedPassword);
  return bcrypt.compareSync(password, hashedPassword);
};

// generates jwt token from user obj
const generateToken = async (data) => {
  const user = {
    userId: data.userId,
    username: data.username,
    email: data.email,
  }
  return jwt.sign({ user }, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRATION_HOURS}h` }); 
};

/************************ JWT AUTHENTICATION MIDDLEWARE ************************/

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

// POST /user/signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
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

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// POST /user/login
const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmail = emailRegex.test(emailOrUsername)

    const user = await User.findOne({
      where: isEmail ? { email: emailOrUsername } : { username: emailOrUsername }
    });

    const loginVal = isEmail ? 'email' : 'username';
    if (!user || !await comparePassword(password, user.password)) {
      return res.status(401).json({ message: `Invalid ${loginVal} or password` });
    }

    const token = await generateToken(user);

    await user.save();
    res.status(200).json({ message: 'Login successful', token, username: user.username });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
};

// GET /user/:userId/profile
const profile = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['username']
    });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user profile', error: error.message });
  }
};

/********************* Authenticated User Routes **********************/

// GET /user/dashboard
const dashboard = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User dashboard fetched successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error sending user dashboard', error: error.message });
  }
};

// PUT /user/change-username
const changeUsername = async (req, res) => {
  const { userId } = req.user;
  const { password, newUsername } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: 'Password is not correct' });

    user.username = newUsername;
    
    await user.save();
    res.status(200).json({ message: 'Username updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating username', error: error.message });
  }
}

// PUT /user/change-password
const changePassword = async (req, res) => {
  const { userId } = req.user;
  const { password, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: 'Current Password is not correct' });
    
    user.password = await hashPassword(newPassword);
    await user.save();
    res.status(200).json({ message: 'Password updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating password', error: error.message });
  }
};

// PUT /user/change-email
const changeEmail = async (req, res) => {
  const { userId } = req.user;
  const { password, newEmail } = req.body;

  console.log("changeEmail called, data:");
  console.log("userId: ", userId);
  console.log("password: ", password);
  console.log("newEmail: ", newEmail);
  
  if (!newEmail)
    return res.status(400).json({ message: 'Email is required' });

  if (!password)
    return res.status(400).json({ message: 'Password is required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!newEmail.match(emailRegex))
    return res.status(400).json({ message: 'Invalid email format' });

  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: 'Password is not correct' });

    user.email = newEmail;
    
    await user.save();
    res.status(200).json({ message: 'Email updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating email', error: error.message });
  }
};

// PUT /user/change-profile-picture
const changeProfilePicture = async (req, res) => {
  const { userId } = req.user.userId;
  const { profilePictureUrl } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (profilePictureUrl) user.profilePictureUrl = profilePictureUrl;
    
    await user.save();
    res.status(200).json({ message: 'Profile picture updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile picture', error: error.message });
  }
};

// DELETE /user/:userId/delete
const deleteUser = async (req, res) => {
  const { userId } = req.user;
  const { password, confirmation } = req.body;

  if (!password || !confirmation)
    return res.status(400).json({ message: 'Password and confirmation are required' });

  if (confirmation !== 'Delete Account')
    return res.status(400).json({ message: 'Confirmation text does not match' });

  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: 'Password is not correct' });

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
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error: error.message });
  }
};

/************************ JWT TOKEN VALIDATION ************************/

// validates jwt token
// returns user obj if valid
// TODO call once per session begin in frontend
const validateToken = async (req, res) => {
  const { user } = req.user;
  res.status(200).json({ message: 'Token is valid', user });
};

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
