// {
//   name,
//   email,
//   password,
//   age,
//   role
// }

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already Exists"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    role: {
      type: String,
      // Restricts this field strictly to these three options
      enum: ["student", "admin", "teacher"],
      default: "student",
    },
  },
  { timestamps: true },
);
userSchema.pre('save',async function (){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10)
})

export const UserModel=new mongoose.model("User",userSchema)