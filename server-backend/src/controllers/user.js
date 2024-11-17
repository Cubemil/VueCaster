const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/************************ ENVIRONMENT VARIABLES AND HELPER FUNCTIONS ************************/

const secretKey = process.env.JWT_SECRET;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// POST /user/auth
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, secretKey);

    return res.status(200).json({
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      roles: decoded.roles
    });
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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !await comparePassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({
      userId: user.userId,
      username: user.username,
      email: user.email,
      password: user.password,
      roles: user.roles 
    }, secretKey, { expiresIn: '1h' }); 
      
    user.token = token;
    user.tokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiration time in ms

    await user.save();
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
};

// GET /user/:userId/profile
const profile = async (req, res) => {
  const { userId } = req.params;

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

// PUT /user/:userId/update
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, password } = req.body;

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

/************************ EXPORT CONTROLLERS ************************/

module.exports = {
  signup,
  login,
  profile,
  updateUser,
  deleteUser 
};
