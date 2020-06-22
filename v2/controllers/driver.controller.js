import Driver from "../models/driver.model";
import User from "../models/user.model";
import Ride from "../models/ride.model";
import Member from "../models/member.model";
import { Expo } from "expo-server-sdk";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

let expo = new Expo();

const MINIMUM_DISTANCE_FOR_MEMBER_NOTIFICATION = 500; //METERS
const MAXIMUM_DISTANCE_FOR_MEMBER_NOTIFICATION = 1000; //METERS

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
    }).lean();

    if (!user) throw new Error("Invalid Credentials!");

    const driver = await Driver.findOne({
      uid: user._id,
    }).lean();

    if (!driver) throw new Error("Invalid Credentials!");

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) throw new Error("Invalid Credentials!");

    const mem = {
      ...driver,
      username: user.username,
    };

    const token = jwt.sign(mem, process.env.JWT_SECRET);

    return res.status(200).json({
      auth: {
        user: mem,
        token,
        role: "driver",
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdateDriver = async (req, res) => {
  try {
    const { _id, name, mobile } = req.body;

    await Driver.findByIdAndUpdate(_id, {
      name,
      mobile,
    });

    return res.status(200).json({
      updated: true,
    });
  } catch (e) {
    if (e.codeName === "DuplicateKey" && e.keyValue.mobile)
      return res.status(500).json({
        message: `Driver with mobile number ${req.body.mobile} already exists!`,
      });
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdatePassword = async (req, res) => {
  try {
    const { username, password, currentPassword } = req.body;

    const user = await User.findOne({ username });

    if (!user) throw new Error("User not found!");

    if (!bcrypt.compareSync(currentPassword, user.password))
      throw new Error("Current password is not correct!");

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

export const StartRide = async (req, res) => {
  try {
    const { startPosition, driverID } = req.body;

    const ride = new Ride({
      driverID: mongoose.Types.ObjectId(driverID),
      startPosition,
      isActive: true,
      route: [],
    });

    await ride.save();

    return res.status(200).json({
      started: true,
    });
  } catch (e) {
    console.log("Error: ", e.message);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const TrackRide = async (req, res) => {
  try {
    const { driverID, updatedRoute } = req.body;

    const ride = await Ride.findOne({
      driverID: mongoose.Types.ObjectId(driverID),
      isActive: true,
    });
    if (ride) {
      const notifiedMembers = ride.notifiedMembers || [];
      const route = ride.route;

      ride.route = [...route, ...updatedRoute];

      const {
        coords: { latitude, longitude },
      } = updatedRoute[0];

      const members = await Member.find({
        _id: {
          $nin: notifiedMembers,
        },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: MAXIMUM_DISTANCE_FOR_MEMBER_NOTIFICATION,
            $minDistance: MINIMUM_DISTANCE_FOR_MEMBER_NOTIFICATION,
          },
        },
      }).lean();

      let messages = [];
      members.forEach((member) => {
        const tokens = member.notificationToken || [];
        tokens.forEach((token) => {
          if (!Expo.isExpoPushToken(token)) {
            console.error(`Push token ${token} is not a valid Expo push token`);
          } else {
            messages.push({
              to: token,
              sound: "default",
              title: "A Driver is Nearby Your Location",
              body: "Open the app to track the driver location.",
              priority: "high",
              channelId: "default",
            });
          }
        });
        if (tokens.length > 0) {
          notifiedMembers.push(member._id);
        }
      });

      let chunks = expo.chunkPushNotifications(messages);

      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }

      ride.notifiedMembers = notifiedMembers;

      await ride.save();
    }
    return res.status(200).json({
      updated: ride ? true : false,
    });
  } catch (e) {
    console.log("Error: ", e.message);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const StopRide = async (req, res) => {
  try {
    const { driverID } = req.body;

    const ride = await Ride.findOne({
      driverID: mongoose.Types.ObjectId(driverID),
      isActive: true,
    });

    ride.isActive = false;

    await ride.save();

    return res.status(200).json({
      updated: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetRideStatus = async (req, res) => {
  try {
    const { driverID } = req.query;

    const ride = await Ride.findOne({
      driverID: mongoose.Types.ObjectId(driverID),
      isActive: true,
    });

    return res.status(200).json({
      hasActiveRide: ride ? true : false,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
