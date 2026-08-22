import { UserModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { uploadOnCludinary } from "../utils/uploadOnCloudinary.js";

// -------------Home--------------

export const home = async (req, res) => {
  res.send("This is Api User home page");
};

// ------------------Register------------------

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

// ------------------LOGIN-------------------

export const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (password == undefined || email == undefined) {
      return res.status(400).json({
        success: false,
        deme: dsds,
        message:
          email == undefined ? `Please enter email` : `please enter password`,
      });
    }
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
      { $set: { refreshToken } },
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
        // new_cookies:req.cookies.accessToken
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

// -----------------Cookie Access Api-------------------

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

// --------------Delete Api ------------------

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    console.log(deletedUser);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "can't find user for delete",
      });
    }
    res.status(200).json({
      success: true,
      message: "Delete Success",
      Deleted_User: deletedUser,
    });
  } catch (error) {
    console.log(`Error while delete ${error.message}`);
    res.status(500).json({
      success: false,
      message: "User can't delete",
    });
  }
};

// ------------search--------------

export const search = async (req, res) => {
  try {
    const querydata = req.query;
    const [key, value] = Object.entries(querydata)[0];

    const user = await UserModel.find({
      [key]: {
        $regex: value,
        $options: "i",
      },
    });
    if (user.length === 0) {
      throw new ApiError(404, "No data Found");
    }
    res.status(200).json({
      success: true,
      message: "Seatch Success",
      data: [user],
      query: querydata,
    });
  } catch (error) {
    console.log(`Error in search ${error.message}`);
    res.send(error);
  }
};

//---------logout----

export const logout = async (req, res) => {
  try {
    // const user= req.user
    // // clearing Access and refresh token from database

    // user.refreshToken=undefined
    // user.accessToken=undefined
    // await user.save()

    // const options={
    //   httpOnly:true,
    //   secure:true
    // }

    // res.status(200)
    // .clearCookie("accessToken",options)
    // .clearCookie("refreshToken",options)
    // .json({
    //   success:true,
    //   message:"Logout success"
    // })

    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $set: { refreshToken: undefined } },
      { returnDocument: true },
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User Logout success",
      });
  } catch (error) {
    console.log(error?.message || "Error in logout");
  }
};

// -----------Refresh Access Token --------------------

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Refresh token not found in cookies or request body",
      );
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await UserModel.findById(decodedToken?._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const newAccessToken = await user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save();

    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", newAccessToken, options)
      .json({
        success: true,
        message: "Access Token Refreshed successfully",
        newAccessToken,
        newRefreshToken,
      });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error?.message || "Failed to refresh access token",
    });
  }
};

// -----------Get current User (logedin user)---------

export const currentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user?._id).select(
      "-password -createdAt -updatedAt -__v -accessToken -refreshToken",
    );
    res.status(200).json({
      success: true,
      message: `Current User Found`,
      user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `${error?.message || `Current User Not Found`}`,
    });
  }
};

// ------------Change Password -----------

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user?._id);
    if (!oldPassword || !newPassword) {
      throw new ApiError(400, `Old Password And New Passwaord is required`);
    }
    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordCorrect) {
      throw new ApiError(401, `Old Password is Not Correct`);
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Password Changed Success`,
      newPassword,
    });
  } catch (error) {
    res.status(error?.statusCode || 401).json({
      success: false,
      message: error?.message || "Unauthorized request",
    });
  }
};

// ----------Upload Avatar Photo----------

export const uploadAvatar = async (req, res) => {
  try {
    const avatarLocalPath = req.files?.avatar[0].path;
    if (!avatarLocalPath) {
      throw new ApiError(404, "Avatar not found in LocalPath");
    }
    const result = await uploadOnCludinary(avatarLocalPath);
    const user = await UserModel.findById(req.user?._id);
    user.avatar = result.url;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: `Avatar Uploaded Successfully on Cloudinary and Saved in DB`,
      avatar_URL: result.url,
    });
  } catch (error) {
    res.status(error?.ststusCode || 500).json({
      success: false,
      message: `${error?.message} || Error while changeing Avatar`,
    });
  }
};
// -----------------Upload Coverimage-------------------

export const uploadCoverImage = async (req, res) => {
  try {
    const coverImageLocalPath = req.files?.coverImage[0].path;
    if (!coverImageLocalPath) {
      throw new ApiError(404, "Cover Image not found in LocalPath");
    }
    const result = await uploadOnCludinary(coverImageLocalPath);
    const user = await UserModel.findById(req.user?._id);
    user.coverImage = result.url;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: `cover image Uploaded Successfully on Cloudinary and Saved in DB`,
      CoverImage_URL: result.url,
    });
  } catch (error) {
    res.status(error?.ststusCode || 500).json({
      success: false,
      message: `${error?.message} || Error while changeing Cover image`,
    });
  }
};

// -------------------Change User Details------------

export const changeUserDetails = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const obj = {};
    if (name) {
      obj["name"] = name;
    }
    if (email) {
      obj["email"] = email;
    }
    if (password) {
      const newPassword = await bcrypt.hash(password, 10);
      obj["password"] = newPassword;
    }

    if (!email && !name && !password) {
      throw new ApiError(400, "Please provide atleast one field to update");
    }
    const user = await UserModel.findByIdAndUpdate(
      req.user?._id,
      { $set: obj },
      { returnDocument: "after" },
    ).select("-password -createdAt -updatedAt -accessToken -refreshToken");
    res.status(200).json({
      success: true,
      message: `User details updated successfully`,
      user,
    });
  } catch (error) {
    res.status(error?.statusCode || 401).json({
      success: false,
      message: `${error?.message}` || "Error while changing user details",
    });
  }
};

// ------------------Upload Assets (Multiple Files)-------------------

export const uploadAssets = async(req, res) => {
    try {
      const file = req.files.assets;
      res.status(200).json({ message: "File uploaded successfully",files: file });
    } catch (error) {
      res.status(500).json({ message: "Error while uploading file" });
    }
  };
