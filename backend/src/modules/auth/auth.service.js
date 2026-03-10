import User from "../../models/User.js";
import generateOTP from "../../utils/generateOTP.js";
import generateToken from "../../utils/generateToken.js";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/sendEmail.js";

//
// LOGIN
//
export const loginService = async ({ email, password }) => {

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPassword = password.trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.accountStatus !== "active") {
    throw new Error("Account is not active");
  }

  if (user.passwordSetupToken) {
    throw new Error("Please complete password setup first");
  }

  if (!user.password) {
    throw new Error("Password not set");
  }

  const isMatch = await user.comparePassword(normalizedPassword);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  await User.updateOne(
    { _id: user._id },
    { lastLoginAt: new Date() }
  );

  const token = generateToken(user);

  const userObj = user.toObject();
  delete userObj.password;

  return {
    token,
    user: userObj
  };
};


//
// SET PASSWORD (ACCOUNT SETUP)
//
export const setPasswordService = async ({ token, password }) => {

  if (!token || !password) {
    throw new Error("Token and password required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await User.findOne({
    passwordSetupToken: token,
    passwordSetupExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  user.password = password;

  user.passwordSetupToken = undefined;
  user.passwordSetupExpires = undefined;

  user.isRegistered = true;
  user.isVerified = true;

  await user.save();

  return {
    message: "Password set successfully"
  };
};


//
// LOGOUT
//
export const logoutService = async (res) => {

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax"
  });

};


//
// GET CURRENT USER
//
export const getMeService = async (user) => {

  if (!user) {
    throw new Error("Not authenticated");
  }

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;

};


export const forgotPasswordService = async ({ email }) => {

  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();

  user.resetOTP = otp;
  user.resetOTPExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: "InternStatus Password Reset OTP",
    html: `
      <h2>Password Reset OTP</h2>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes</p>
    `
  });

  return { message: "OTP sent to email" };
};

export const resetPasswordService = async ({ email, otp, password }) => {

  if (!email || !otp || !password) {
    throw new Error("Email, OTP and password required");
  }

  
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

    console.log("DB OTP:", user.resetOTP);
console.log("User OTP:", otp);
console.log("Expiry:", user.resetOTPExpires);
console.log("Now:", Date.now());

  if (
    String(user.resetOTP) !== String(otp) ||
    user.resetOTPExpires < Date.now()
  ) {
    throw new Error("Invalid or expired OTP");
  }



  const hashedPassword = await bcrypt.hash(password, 10);

user.password = password; 
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;

  await user.save();

  return { message: "Password reset successful" };
};