import { UserModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
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
    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        success: false,
        message:
          "Access token or Refresh token can't generate..Please login again",
      });
    }
    const setRefreshToken = await UserModel.updateMany(
      { _id: user._id },
      { $set: { refreshToken, accessToken } },
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Login success",
        refresh_and_access_token_update: setRefreshToken,
        // Refresh_Token: refreshToken,
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

export const accessCookie = async (req, res) => {
  console.log(req.cookie.refreshToken);
  console.log(req.cookie.accessToken);
};

// ------Read All Users -------------

export const read = async (req, res) => {
  try {
    const data = await UserModel.find({}).select(
      "-password -createdAt -updatedAt -accessToken -refreshToken",
    );
    res.status(200).json({
      success: true,
      message: "All data find done",
      data: data,
    });
  } catch (error) {
    console.log(`Error in Read Api ${error.message}`);
    res.status(401).json({
      success: false,
      message: "Failed to get data",
    });
  }
};

// -----------    Read By ID --------------

export const readById = async (req, res) => {
  try {
    const data = await UserModel.findById(req.params.id).select(
      "-password -createdAt -updatedAt -accessToken -refreshToken",
    );
    res.status(200).json({
      success: true,
      message: "Data found",
      data: data,
    });
  } catch (error) {
    console.log(`Error in readById api`);
    res.status(404).json({
      success: false,
      message: "Data not found",
    });
  }
};

// -----------PATCH Update -------------------

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, age } = req.body;
    const updateObj = {};
    if (name) updateObj["name"] = name;
    if (email) updateObj["email"] = email;
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateObj["password"] = hashPassword;
    }
    if (age) updateObj["age"] = age;
    const isUpdated = await UserModel.findByIdAndUpdate(id, updateObj, {
      returnDocument: "after",
    }).select("-password -createdAt -updatedAt -accessToken -refreshToken");
    console.log("Update Success");
    res.status(200).json({
      success: true,
      message: "Update operation success",
      user: isUpdated,
    });
  } catch (error) {
    console.log(`error in update ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Update operation faild",
    });
  }
};
