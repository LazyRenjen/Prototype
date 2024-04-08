const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../database");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    // Check if username or email already exists
    const existingUser = await getUserByEmailOrUsername(email, username);
    if (existingUser) {
      // Username or email already exists
      if (existingUser.email === email) {
        return res.render('login', { message: "Email already exists. Please use a different email." });
      }
      if (existingUser.username === username) {
        return res.render('login', { message: "Username already exists. Please choose a different one." });
      }
    }

    // Username and email are unique, hash the password and insert new user data
    const hashedPassword = await bcrypt.hash(password, 8);
    await insertUser(username, email, hashedPassword);
    
    // User registered successfully
    console.log("User registered successfully");
    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal server error");
  }
};

async function getUserByEmailOrUsername(email, username) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM register WHERE email = ? OR username = ?', [email, username], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
}

async function insertUser(username, email, password) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO register (username, email, password) VALUES (?, ?, ?)', [username, email, password], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email exists in the register table
    const user = await getUserByEmail(email);
    if (!user) {
      return res.render('login', { message: "Email not found. Please register." });
    }

    // Email exists, compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render('login', { message: "Password incorrect" });
    }

    // Password matches, insert login data and render the main page
    await insertLoginData(user.email);
    res.render('main', { username: user.username });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal server error");
  }
};

async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM register WHERE email = ?', [email], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
}

async function insertLoginData(email) {
  return new Promise((resolve, reject) => {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query('INSERT INTO login (email, login_time) VALUES (?, ?)', [email, currentTime], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}
