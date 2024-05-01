import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    id: String,
    username: String,
    email: String,
    fullname: String,
    password: String,
    avatar: String,
    refreshToken: String,
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestemps: true },
);

// --save password in encrypt data--
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // save only when user send password
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// --check password--
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// --genrate access token--
userSchema.methods.generateAccessToken = async function () {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.access_token_secret,
    {
      expiresIn: process.env.access_token_expiry,
    },
  );
};

// --genrate refresh token--
userSchema.methods.refreshAccessToken = async function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.refresh_token_secret,
    {
      expiresIn: process.env.refresh_token_expiry,
    },
  );
};

// ---
export const User = mongoose.model("User", userSchema);
