import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String, // cloudnary url
      required: true,
    },

    coverImage: {
      type: String, // cloudnary url
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  // here we create the self declartion method as per know about our javascript fundamentals
  return await bcrypt.compare(password, this.password); // here password is the actual password user provide and the this.passwoord is the bcryot password
}; // here async and await use the beacuase the this process bcryption type process is the taken the cpu processing  unit time

userSchema.methods.generateAcccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, // give the mongodb
      email: this.email,
      username: this.username,
      fullname: this.fullname, // here all the left hand side name is the pelod and the right hannd side informaton is the database  give the informatin
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
}; // self decleration functon async await here youe choice

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    // YOU CAN SEE THE JWWT ASSIGNMENT YOU INCLDE THAT ALL THE DOCS
    {
      _id: this._id, // give the mongodb
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
