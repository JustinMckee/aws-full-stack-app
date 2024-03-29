import express from "express";
import passwordService from "../services/passwordService.js";
import tokenService from "../services/tokenService.js";
import userService from "../services/userService.js";

export const router = express.Router();

router.post("/token", async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    if (!await passwordService.verifyPassword(password, user.hashedPassword, user.salt)) {
      return res.status(401).json({ message: "Unauthorized password" });
    }
    const { accessToken, refreshToken } = await tokenService.generateTokens(user);
    return res.json({ access_token: accessToken, refresh_token: refreshToken, token_type: "bearer" });
  } catch (error) {
    console.error("Get token error", error)
    return res.status(500).send("Error occured with token")
  }
});

router.post("/refresh", async (req, res) => {
  try{
    const { refreshToken } = req.body
    const jwtPayload = tokenService.decodeToken(refreshToken)
    const user = await userService.findByEmail(jwtPayload.email)
    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokens(user);
    return res.json({ access_token: accessToken, refresh_token: newRefreshToken, token_type: "bearer" });
  } catch(error){
    console.error("Refresh token error", error)
    return res.status(500).send("Error occured with refresh")
  }
});