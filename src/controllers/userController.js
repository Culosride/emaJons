const bcrypt = require("bcrypt")
const { userExists } = require("../middleware/validation")
const User = require("../models/user")

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required." })
  const user = await User.findOne({ username: username });
  if(!user) res.sendStatus(401);      // unauthorized if user doesn't exist
  const matchPsw = bcrypt.compare(password, user.password)
  if (matchPsw) {
    // generate JWTs here
    res.json({ message: `${username} is logged in` });
  } else {
    res.sendStatus(401);
  }
}

// for future endevours
const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required." })
  const duplicateUser = await User.findOne({username: username});
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
