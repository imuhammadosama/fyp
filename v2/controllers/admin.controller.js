import User from "../models/user.model";
import Driver from "../models/driver.model";
import { Member } from "../models/member.model";
import Guard from "../models/guard.model";
import Alert from "../models/alerts.model";
import Ride from "../models/ride.model";
import Worker from "../models/worker.model";
import Service from "../models/service.model";
import HiredService from "../models/hired-services.model";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

export const CreateAdmin = async (req, res) => {
  const passwordHash = bcrypt.hashSync("comfortzone");

  const user = new User({
    username: "admin",
    email: "admin@comfortzone.pk",
    password: passwordHash,
    role: "Admin",
  });
  await user.save();
  return res.status(200).json({
    added: true,
  });
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
      role: "Admin",
    }).lean();

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new Error("Invalid Credentials!");

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      auth: {
        token,
        user: {
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (e) {
    return res.status(403).json({
      message: e.message,
    });
  }
};

export const AddDriver = async (req, res) => {
  try {
    const { name, mobile, username, password } = req.body;

    const numArray = [mobile];

    if (mobile.startsWith("0")) {
      numArray.push(`+92${mobile.substring(1)}`);
    } else if (mobile.startsWith("+92")) {
      numArray.push(`0${mobile.substring(3)}`);
    }

    const m = await Driver.findOne({ mobile: { $in: numArray } }).lean();
    if (m)
      throw new Error(`Driver with mobile number ${mobile} already exist!`);

    const passwordHash = bcrypt.hashSync(password);

    const user = new User({
      username,
      password: passwordHash,
      role: "Driver",
    });

    user.save(async (err, user) => {
      if (err) {
        return res.status(500).json({
          message: `User with ${username} already exists!`,
        });
      }
      const driver = new Driver({
        uid: user._id,
        name,
        mobile,
      });
      await driver.save();
      return res.status(200).json({
        success: true,
      });
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.aggregate([
      {
        $lookup: {
          from: "newusers",
          localField: "uid",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          name: "$name",
          mobile: "$mobile",
          uid: "$uid",
          username: "$user.username",
        },
      },
    ]);
    return res.status(200).json({
      drivers,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetDriverRides = async (req, res) => {
  try {
    const { driverID } = req.query;

    const previousRides = await Ride.find({
      driverID: mongoose.Types.ObjectId(driverID),
      isActive: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    const activeRide = await Ride.findOne({
      driverID: mongoose.Types.ObjectId(driverID),
      isActive: true,
    }).lean();

    return res.status(200).json({
      previousRides,
      activeRide,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const TrackActiveRide = async (req, res) => {
  try {
    const { rideID } = req.query;

    const ride = await Ride.findOne({
      _id: rideID,
    }).lean();

    return res.status(200).json({
      ride,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdateDriver = async (req, res) => {
  try {
    const { name, mobile, _id } = req.body;

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
    const { username, password } = req.body;

    const user = await User.findOne({ username });

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

export const DeleteDriver = async (req, res) => {
  try {
    const { _id, username } = req.body;

    await User.remove({
      username,
    });

    await Driver.remove({
      _id,
    });

    return res.status(200).json({
      deleted: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const AddMember = async (req, res) => {
  try {
    const {
      name,
      mobile,
      membershipNumber,
      username,
      password,
      houseNumber,
      sector,
      block,
      coords,
    } = req.body;

    const numArray = [mobile];

    if (mobile.startsWith("0")) {
      numArray.push(`+92${mobile.substring(1)}`);
    } else if (mobile.startsWith("+92")) {
      numArray.push(`0${mobile.substring(3)}`);
    }

    const m = await Member.findOne({ mobile: { $in: numArray } }).lean();
    if (m)
      throw new Error(`Member with mobile number ${mobile} already exist!`);

    const passwordHash = bcrypt.hashSync(password);

    const user = new User({
      username,
      password: passwordHash,
      role: "Member",
    });

    user.save(async (err, user) => {
      if (err) {
        return res.status(500).json({
          message: `User with ${username} already exists!`,
        });
      }
      const member = new Member({
        uid: user._id,
        name,
        mobile,
        membershipNumber,
        houseNumber,
        sector,
        block,
        coords,
        location: { type: "Point", coordinates: [coords.lng, coords.lat] },
      });
      await member.save();
      return res.status(200).json({
        success: true,
      });
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetAllMembers = async (req, res) => {
  try {
    const members = await Member.aggregate([
      {
        $lookup: {
          from: "newusers",
          localField: "uid",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          name: "$name",
          mobile: "$mobile",
          uid: "$uid",
          membershipNumber: "$membershipNumber",
          username: "$user.username",
          houseNumber: "$houseNumber",
          sector: "$sector",
          block: "$block",
          coords: "$coords",
        },
      },
    ]);
    return res.status(200).json({
      members,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdateMember = async (req, res) => {
  try {
    const {
      name,
      mobile,
      _id,
      membershipNumber,
      houseNumber,
      sector,
      block,
      coords,
    } = req.body;

    await Member.findByIdAndUpdate(_id, {
      name,
      mobile,
      membershipNumber,
      houseNumber,
      sector,
      block,
      coords,
      location: { type: "Point", coordinates: [coords.lng, coords.lat] },
    });

    return res.status(200).json({
      updated: true,
    });
  } catch (e) {
    if (e.codeName === "DuplicateKey" && e.keyValue.mobile)
      return res.status(500).json({
        message: `Member with mobile number ${req.body.mobile} already exists!`,
      });
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const DeleteMember = async (req, res) => {
  try {
    const { _id, username } = req.body;

    await User.remove({
      username,
    });

    await Member.remove({
      _id,
    });

    return res.status(200).json({
      deleted: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const AddGuard = async (req, res) => {
  try {
    const { name, mobile, sector, block } = req.body;

    const numArray = [mobile];

    if (mobile.startsWith("0")) {
      numArray.push(`+92${mobile.substring(1)}`);
    } else if (mobile.startsWith("+92")) {
      numArray.push(`0${mobile.substring(3)}`);
    }

    const m = await Guard.findOne({ mobile: { $in: numArray } }).lean();
    if (m) throw new Error(`Guard with mobile number ${mobile} already exist!`);

    const guard = new Guard({
      name,
      mobile,
      sector,
      block,
    });
    await guard.save();
    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetAllGuards = async (req, res) => {
  try {
    const guards = await Guard.find().lean();
    return res.status(200).json({
      guards,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdateGuard = async (req, res) => {
  try {
    const { name, mobile, sector, block, _id } = req.body;

    await Guard.findByIdAndUpdate(_id, {
      name,
      mobile,
      sector,
      block,
    });

    return res.status(200).json({
      updated: true,
    });
  } catch (e) {
    if (e.codeName === "DuplicateKey" && e.keyValue.mobile)
      return res.status(500).json({
        message: `Guard with mobile number ${req.body.mobile} already exists!`,
      });
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const DeleteGuard = async (req, res) => {
  try {
    const { _id } = req.body;

    await Guard.remove({
      _id,
    });

    return res.status(200).json({
      deleted: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetAlerts = async (req, res) => {
  try {
    const { status } = req.query;

    const alerts = await Alert.aggregate([
      {
        $match: {
          status,
        },
      },
      {
        $lookup: {
          from: "guards",
          localField: "guardID",
          foreignField: "_id",
          as: "guard",
        },
      },
      {
        $unwind: "$guard",
      },
      {
        $lookup: {
          from: "members",
          localField: "memberID",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: "$member",
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return res.status(200).json({ alerts });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.aggregate([
      {
        $lookup: {
          from: "newusers",
          localField: "uid",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    return res.status(200).json({
      workers,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetWorkerServices = async (req, res) => {
  try {
    const { id } = req.params;

    const services = await Service.find({
      uid: mongoose.Types.ObjectId(id),
      isDeleted: false,
    }).lean();

    return res.status(200).json({
      services,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetService = async (req, res) => {
  try {
    const { id } = req.params;

    const hiredServices = await HiredService.aggregate([
      {
        $match: {
          serviceID: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "members",
          localField: "memberID",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: "$member",
      },
    ]);

    return res.status(200).json({
      hiredServices,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const DeleteService = async (req, res) => {
  try {
    const { id } = req.body;

    const service = await Service.findById(id);

    service.isDeleted = true;

    await service.save();

    return res.status(200).json({
      deleted: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetAllServices = async (req, res) => {
  try {
    const services = await Service.find({
      isDeleted: false,
    }).lean();

    return res.status(200).json({
      services,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: e.message,
    });
  }
};
