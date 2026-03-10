import crypto from "crypto";
import User from "../models/User.js";

const createUserWithToken = async (
  {
    email,
    role,
    referenceId = null,
    referenceModel,
    createdBy,
    expiresInHours = 48
  },
  session = null
) => {

  // =============================
  // TOKEN GENERATION
  // =============================

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expireDate = new Date(
    Date.now() + expiresInHours * 60 * 60 * 1000
  );


  // =============================
  // CHECK EXISTING USER
  // =============================

  let user = await User.findOne({ email }).session(session);

  if (user) {

    // Role mismatch safety
    if (user.role !== role) {
      throw new Error("User already exists with different role");
    }

    // Update setup token
    user.passwordSetupToken = hashedToken;
    user.passwordSetupExpires = expireDate;

    user.password = null;
    user.isRegistered = false;
    user.isVerified = false;

    if (referenceId) user.referenceId = referenceId;
    if (referenceModel) user.referenceModel = referenceModel;

    await user.save({ session });

  } else {

    // =============================
    // CREATE NEW USER
    // =============================

    user = new User({
      email,
      role,
      referenceId,
      referenceModel,
      createdBy,

      password: null,
      isRegistered: false,
      isVerified: false,

      passwordSetupToken: hashedToken,
      passwordSetupExpires: expireDate
    });

    await user.save({ session });
  }


  return {
    user,
    rawToken
  };
};

export default createUserWithToken;