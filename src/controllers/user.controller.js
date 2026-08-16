import { UserModel } from "../models/user.model.js";

export const home = async (req, res) => {
  res.send("This is Api User home page");
};

export const register = async (req, res) => {
  try {
    const { name, email, age, password, role } = req.body;
    const user = UserModel({
      name,
      email,
      age,
      password,
    });
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.log(`Register Error ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
};

export const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found with this email",
      });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Password is not correct",
      });
    }
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    if(!accessToken && !refreshToken){
      return res.status(401).json({
        success: false,
        message: "Access token or Refresh token can't generate..Please login again",
      });
    }
    const setRefreshToken=await user.updateMany

    res.status(200).json({
      success: true,
      message: "Login success",
      Refresh_Token: refreshToken,
    });
    console.log("login success");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: "Login Failed",
    });
  }
};
