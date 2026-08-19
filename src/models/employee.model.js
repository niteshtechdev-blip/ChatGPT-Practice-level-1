import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee Name is Required"],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Prevents duplicate email records
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: {
        values: ["tech", "managment", "support", "others"],
        message: "{value} is not valid category",
      },
    },
    employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
    role: {
      type: String,
      enum: ["Employee", "Manager", "Admin"],
      default: "Employee",
    },
    bankDetails: {
      accountNumber: { type: String, trim: true },
      bankName: { type: String, trim: true },
      routingNumber: { type: String, trim: true },
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
    },
    salary: {
      type: Number,
      required: true,
      min: 5000,
    },
  },
  { timestamps: true },
);

export const EmployeeModel = mongoose.model("Employee", employeeSchema);
