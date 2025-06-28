const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    //schema level validation
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true, //validation in schema
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address " + value);
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        // this validate method is only called when user is created
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
    },
    authSource: {
      type: String,
      enum: ["self", "google"],
      default: "self",
    },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  // this not access in arrow function
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@1234$", {
    expiresIn: "1d",
  }); //creds,secret key
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema); //name of Model,schema
