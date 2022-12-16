const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,         // only accessible by web server
  secure: true,           // only for https, activate for deployment
  sameSite: "None",       // cross-site cookie
  maxAge: 24*60*60*1000   // cookie expiration time matches refreshToken's
}

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: "Username and password required." })

  const user = await User.findOne({ username: username }).exec();
  if(!user) res.status(401).json({message: "Unauthorized."});      // unauthorized if user doesn't exist

  const matchPsw = await bcrypt.compare(password, user.password)
  if(!matchPsw) res.status(401).json({message: "Unauthorized."});      // unauthorized if pws doesn't match

  const accessToken = jwt.sign(
    {
      UserInfo: {
      username: user.username,
      roles: user.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );
  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Generates secure cookie for authentication with refresh token
  res.cookie("jwt", refreshToken, cookieOptions);
  // sends accessToken to frontend for clientside authentication. Contains username and roles
  res.json({ accessToken });
}

const handleRefreshToken = async (req, res) => {
  // look for cookies and if thez have jwt property with  optional chain oparator
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
        { expiresIn: "30s" }
      );
      res.json({ accessToken })
    }
  );
}

const handleLogout = async (req, res) => {
  // delete accessToken also client-side
  console.log(req.cookies, "ciao")
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).json({message: "204 No Content"}) // successfull req no content sent
  res.clearCookie("jwt", cookieOptions); // set also secure option for production (https), in dev we use http
  res.status(200).json({ "message": "Cookie cleared" });
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

module.exports = { handleLogin, handleNewUser, handleRefreshToken, handleLogout };
