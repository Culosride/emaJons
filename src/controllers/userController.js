const bcrypt = require("bcrypt");
const { userExists } = require("../middleware/tagValidation");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required." })
  const user = await User.findOne({ username: username }).exec();
  if(!user) res.sendStatus(401);      // unauthorized if user doesn't exist

  const matchPsw = bcrypt.compare(password, user.password)
  if (matchPsw) {
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
      );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
      );
    user.refreshToken = refreshToken
    await user.save()

    // Generates secure cookie for authentication with refresh token
    res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24*60*60*1000 });

    // sends accessToken to frontend for clientside authentication
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
}

// for future endevours
const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required." })
  const duplicateUser = await User.findOne({username: username}).exec();
  if(duplicateUser) return res.status(409).json({ message: "Username already exists" })
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: `User ${ username } successfully created.` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { handleLogin, handleNewUser };
