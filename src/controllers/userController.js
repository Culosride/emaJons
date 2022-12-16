const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required." })
  const user = await User.findOne({ username: username }).exec();
  if(!user) res.sendStatus(401);      // unauthorized if user doesn't exist
  (password, user.password)
  const matchPsw = await bcrypt.compare(password, user.password)
  const roles = Object.values(user.roles)
  if (matchPsw) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
        username: user.username,
        roles: roles
        }
      },
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

const handleRefreshToken = async (req, res) => {
  // look for cookies and if thez have jwt property with optional chain oparator
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken: refreshToken}).exec()
  if(!user) return res.sendStatus(403) // Forbidden
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if(err || user.username !== decoded.username) return res.sendStatus(403);
      const roles = Object.values(user.roles)
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            roles: roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken })
    }
  );
}

const handleLogout = async (req, res) => {
  // delete accessToken also client-side

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204) // successfull req no content sent
  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken }).exec();
  if(!user) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24*60*60*1000});
    return res.sendStatus(204);
  };

  user.refreshToken = "";
  await user.save();

  res.clearCookie("jwt", { httpOnly: true, maxAge: 24*60*60*1000 }); // set also secure option for production (https), in dev we use http
  res.sendStatus(204);
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
      roles: { BasicUser: 1909 },
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: `User ${ username } successfully created.` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { handleLogin, handleNewUser, handleRefreshToken, handleLogout };
