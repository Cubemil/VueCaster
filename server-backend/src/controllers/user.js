const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/************************ ENVIRONMENT VARIABLES AND HELPER FUNCTIONS ************************/

// fetch jwt secret key from env variables (note: not added to git)
const secretKey = process.env.JWT_SECRET;

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
    roles: data.roles
  }
  return jwt.sign({ user }, secretKey, { expiresIn: '1h' }); 
};

/************************ JWT AUTHENTICATION MIDDLEWARE ************************/

// POST /user/authenticate
const authenticate = async (req, res, next) => {
  try {
    // get token from header
    const token = req.header('Authorization').replace('Bearer ', '');

    // decoded from token and put as request body
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    // call actual request after
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' }); 
  }
};

/************************ HTTP REQUEST HANDLERS ************************/

// POST /user/signup
const signup = async (req, res) => {
  const { username, email, password, roles } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    //TODO later dont return user only msg
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roles
    });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user profile', error: error.message });
  }
};

/********************* Authenticated User Routes **********************/

// GET /user/dashboard
const dashboard = async (req, res) => {
  const { userId } = req.user.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['username']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user dashboard', error: error.message });
  }
};

// PUT /user/change-username
const changeUsername = async (req, res) => {
  const { userId } = req.user.userId;
  const { username } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    
    await user.save();
    res.status(200).json({ message: 'Username updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating username', error: error.message });
  }
}

// PUT /user/change-password
const changePassword = async (req, res) => {
  const { userId } = req.user.userId;
  const { password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    
    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
};

// PUT /user/change-email
const changeEmail = async (req, res) => {
  const { userId } = req.user.userId;
  const { email } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email) user.email = email;
    
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
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
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
