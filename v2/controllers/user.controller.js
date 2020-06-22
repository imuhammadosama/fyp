import Member from "../models/member.model";
import Driver from "../models/driver.model";
import User from "../models/user.model";

require("dotenv").config();

const bcrypt = require("bcryptjs");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

export const RecoverPasswordBySMS = async (req, res) => {
  try {
    const { mobile, role } = req.body;

    const numArray = [mobile];
    let num = mobile;

    if (mobile.startsWith("0")) {
      num = `+92${mobile.substring(1)}`;
      numArray.push(num);
    } else if (mobile.startsWith("+92")) {
      numArray.push(`0${mobile.substring(3)}`);
    }

    let id;

    if (role === "member") {
      const member = await Member.findOne({
        mobile: {
          $in: numArray,
        },
      }).lean();
      if (!member)
        throw new Error(`Member with mobile number ${mobile} doesn't exist!`);

      id = member.uid;
    } else if (role === "driver") {
      const driver = await Driver.findOne({
        mobile: {
          $in: numArray,
        },
      }).lean();
      if (!driver)
        throw new Error(`Driver with mobile number ${mobile} doesn't exist!`);

      id = driver.uid;
    } else {
      const worker = await Worker.findOne({
        mobile: {
          $in: numArray,
        },
      }).lean();
      if (!worker)
        throw new Error(`Worker with mobile number ${mobile} doesn't exist!`);

      id = worker.uid;
    }

    client.verify
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: num,
        channel: "sms",
      })
      .then((verification) => {
        console.log(verification);
        return res.status(200).json({
          codeSent: true,
          id,
          role,
          mobile,
        });
      })
      .catch((err) => {
        console.log("Twilio Error: ", err);
        return res.status(500).json({
          message: "Internal Server Error while processing request!",
        });
      });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const VerifyRecoveryCode = async (req, res) => {
  try {
    const { code, mobile } = req.body;

    let num;

    if (mobile.startsWith("0")) {
      num = `+92${mobile.substring(1)}`;
    } else {
      num = mobile;
    }

    client.verify
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: num,
        code,
      })
      .then((verification) => {
        console.log(verification);
        if (verification.status === "approved") {
          return res.status(200).json({
            verified: verification.valid,
          });
        } else {
          return res.status(500).json({
            message: "You've entered invalid code.",
          });
        }
      })
      .catch((err) => {
        console.log("Twilio Error: ", err);
        return res.status(500).json({
          message: "Internal Server Error while processing request!",
        });
      });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdatePassword = async (req, res) => {
  try {
    const { id, password, role } = req.body;

    const user = await User.findById(id);

    if (!user) throw new Error("User not found!");

    user.password = bcrypt.hashSync(password);
    await user.save();
    return res.status(200).json({
      updated: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
