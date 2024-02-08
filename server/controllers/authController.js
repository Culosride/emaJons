const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Category = require('../models/category');
const Post = require('../models/post');
const _ = require('lodash');

const refreshDays = 30

const cookieOptions = {
  // httpOnly: true,         // only accessible by web server
  secure: true,           // only for https, activate for deployment
  sameSite: "None",       // cross-site cookie
  maxAge: 24*60*60*1000*refreshDays   // cookie expiration time matches refreshToken's
}

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: "Username and password required." })

  const user = await User.findOne({ username: username }).exec();
  if(!user) return res.status(401).json({message: "Unauthorized."});      // unauthorized if user doesn't exist

  const matchPsw = await bcrypt.compare(password, user.password)
  if(!matchPsw) return res.status(401).json({message: "Unauthorized."});      // unauthorized if pws doesn't match

  const accessToken = jwt.sign(
    {
      UserInfo: {
      username: user.username,
      roles: user.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${refreshDays}d` }
  );

  // Generates secure cookie for authentication with refresh token
  res.cookie("jwt", refreshToken, cookieOptions);
  // sends accessToken to frontend for clientside authentication. Contains username and roles
  res.json({ accessToken });
}

const handleRefreshToken = async (req, res) => {
  // look for cookies and if they have jwt property with optional chain oparator
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(401).json({message: "Unauthorized."});

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if(err) return res.status(403).json({message: "Forbidden."});

      const user = await User.findOne({ username: decoded.username }).exec();
      if(!user) return res.status(401).json({message: "Unauthorized."});

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            roles: user.roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      res.json({ accessToken })
    }
  );
}

const handleLogout = async (req, res) => {
  // delete accessToken also client-side
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).json({message: "204 No Content"}) // successfull req no content sent
  res.clearCookie("jwt", cookieOptions); // set also secure option for production (https), in dev we use http
  res.status(200).json({ "message": "Cookie cleared" });
}

const validatePath = async (req, res) => {
  const { category, postId } = req.params

  const catExists = await Category.findOne({name: _.capitalize(category)})
  if(!catExists) {
    return res.status(404).json({ message: "Category not found." });
  };

  // mongoose only accepts 24 chars, without this the app just breaks
  if (postId && postId.length === 24) {
    const postExists = await Post.findById(postId)

    if (postExists.category !== category) {
      return res.status(404).json({message: "This resource doesn't exist"});
    }

    if(!postExists) {
      console.log("Post does not exist")
      return res.status(404).json({message: "This resource doesn't exist"});
    }
  } else if (postId) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }


  return res.status(200).json({message: "Path is valid"})
}

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required." })
  const duplicateUser = await User.findOne({username: username}).exec();
  if(duplicateUser) return res.status(409).json({ message: "Username already exists" })
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      roles: { BasicUser: 1909 },
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: `User ${ username } successfully created.` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { handleLogin, handleNewUser, handleRefreshToken, handleLogout, validatePath };
