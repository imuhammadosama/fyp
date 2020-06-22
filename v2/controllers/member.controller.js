import Member from "../models/member.model";
import User from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import * as _ from "lodash";
import Service from "../models/service.model";
import HiredService from "../models/hired-services.model";
import Driver from "../models/driver.model";
import Ride from "../models/ride.model";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");

export const Login = async (req, res) => {
  try {
    const { membershipNumber, password, token: notificationToken } = req.body;

    const member = await Member.findOne({
      membershipNumber,
    });

    if (!member) throw new Error("Invalid Credentials!");

    const user = await User.findOne({
      _id: member.uid,
    }).lean();

    if (!user) throw new Error("Invalid Credentials!");

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) throw new Error("Invalid Credentials!");

    // Saving notification token

    const notificationTokens = member.notificationToken || [];

    member.notificationToken = [...notificationTokens, notificationToken];
    await member.save();

    const mem = {
      ...member.toJSON(),
      username: user.username,
    };

    const token = jwt.sign(mem, process.env.JWT_SECRET);

    return res.status(200).json({
      auth: {
        user: mem,
        token,
        role: "member",
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdateMember = async (req, res) => {
  try {
    const { _id, name, mobile } = req.body;

    await Member.findByIdAndUpdate(_id, {
      name,
      mobile,
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

export const AddNewService = async (req, res) => {
  try {
    const { uid, title, mobile, address, image, category } = req.body;

    const randomID = uuidv4();

    const buffer = Buffer.from(image, "base64");

    const filename = `uploads/${randomID}.jpg`;

    fs.writeFile(`public/${filename}`, buffer, async (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Internal Server Error. Try again!",
        });
      } else {
        const service = new Service({
          uid: mongoose.Types.ObjectId(uid),
          title,
          mobile,
          address,
          category,
          imagePath: filename,
        });

        await service.save();

        return res.status(200).json({
          added: true,
        });
      }
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdateService = async (req, res) => {
  try {
    const { id, title, mobile, address, image, category } = req.body;

    const service = await Service.findById(id);

    if (image) {
      const imagePath = "public/" + service.imagePath;

      fs.unlink(imagePath, (error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Internal Server Error. Try again!",
          });
        } else {
          const randomID = uuidv4();

          const buffer = Buffer.from(image, "base64");

          const filename = `uploads/${randomID}.jpg`;

          fs.writeFile(`public/${filename}`, buffer, async (error) => {
            if (error) {
              console.log(error);
              return res.status(500).json({
                message: "Internal Server Error. Try again!",
              });
            } else {
              service.title = title;
              service.mobile = mobile;
              service.address = address;
              service.category = category;
              service.imagePath = filename;

              await service.save();

              return res.status(200).json({
                added: true,
              });
            }
          });
        }
      });
    } else {
      service.title = title;
      service.mobile = mobile;
      service.address = address;
      service.category = category;

      await service.save();

      return res.status(200).json({
        added: true,
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetServices = async (req, res) => {
  try {
    const { uid, available, category, my, hired } = req.query;

    let services;

    if (my) {
      const data = await Service.find({ uid, isDeleted: false });
      services = _.groupBy(data, "category");
    } else if (available) {
      services = await Service.find({
        uid: {
          $ne: uid,
        },
        category,
        isDeleted: false,
      });
    } else if (hired) {
      services = await HiredService.aggregate([
        {
          $match: {
            memberID: mongoose.Types.ObjectId(uid),
            isCompleted: false,
            $or: [
              { isAccepted: true, isAcceptanceStatusUpdated: true },
              { isAccepted: false, isAcceptanceStatusUpdated: false },
            ],
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceID",
            foreignField: "_id",
            as: "service",
          },
        },
        {
          $unwind: "$service",
        },
      ]);
    }

    if (!services) {
      services = my ? {} : [];
    }

    return res.status(200).json({
      services,
    });
  } catch (e) {
    console.log(e);
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

export const HireService = async (req, res) => {
  try {
    const { serviceID, memberID } = req.body;

    const hiredService = new HiredService({
      serviceID: mongoose.Types.ObjectId(serviceID),
      memberID: mongoose.Types.ObjectId(memberID),
    });

    await hiredService.save();

    return res.status(200).json({
      hired: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetHireStatus = async (req, res) => {
  try {
    const { serviceID, memberID } = req.query;

    let doc;

    let canHire = true;
    let canMarkAsComplete = false;

    doc = await HiredService.findOne({
      memberID: mongoose.Types.ObjectId(memberID),
      serviceID: mongoose.Types.ObjectId(serviceID),
      isCompleted: false,
      isAcceptanceStatusUpdated: false,
      isAccepted: false,
    });

    if (doc) canHire = false;

    doc = await HiredService.findOne({
      memberID: mongoose.Types.ObjectId(memberID),
      serviceID: mongoose.Types.ObjectId(serviceID),
      isCompleted: false,
      isAcceptanceStatusUpdated: true,
      isAccepted: true,
    });

    if (doc) {
      canHire = false;
      canMarkAsComplete = true;
    }

    return res.status(200).json({
      canHire,
      canMarkAsComplete,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const MarkServiceAsComplete = async (req, res) => {
  try {
    const { serviceID, memberID, rating } = req.body;

    const doc = await HiredService.findOne({
      memberID: mongoose.Types.ObjectId(memberID),
      serviceID: mongoose.Types.ObjectId(serviceID),
      isCompleted: false,
      isAcceptanceStatusUpdated: true,
      isAccepted: true,
    });

    doc.isCompleted = true;
    doc.rating = rating;

    const service = await Service.findById(serviceID);

    const count = await HiredService.countDocuments({
      serviceID: mongoose.Types.ObjectId(serviceID),
      isCompleted: true,
    });

    const groupedRating = await HiredService.aggregate([
      {
        $match: {
          serviceID: mongoose.Types.ObjectId(serviceID),
          isCompleted: true,
        },
      },
      {
        $group: {
          _id: {
            rating: "$rating",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const sum = groupedRating.reduce(
      (sum, val) => sum + val._id.rating * val.count,
      rating
    );

    const averageRating = sum / (count + 1);

    service.rating = averageRating.toFixed(2);
    service.totalHiring = count + 1;

    await doc.save();
    await service.save();

    return res.status(200).json({
      markedCompleted: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetMyActiveOrders = async (req, res) => {
  try {
    const { uid } = req.query;

    const services = await Service.find(
      {
        uid,
      },
      "_id"
    );

    const serviceIDs = services.map((service) => service._id);

    const hiredServices = await HiredService.aggregate([
      {
        $match: {
          serviceID: {
            $in: serviceIDs,
          },
          isCompleted: false,
          $or: [
            { isAccepted: true, isAcceptanceStatusUpdated: true },
            { isAccepted: false, isAcceptanceStatusUpdated: false },
          ],
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceID",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $lookup: {
          from: "members",
          localField: "memberID",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: "$member" },
    ]);

    return res.status(200).json({
      services: hiredServices,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const ChangeOrderApprovalStatus = async (req, res) => {
  try {
    const { orderID, isAccepted } = req.body;

    await HiredService.findByIdAndUpdate(orderID, {
      isAcceptanceStatusUpdated: true,
      isAccepted,
    });

    return res.status(200).json({
      updated: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetMyOrdersHistory = async (req, res) => {
  try {
    const { uid } = req.query;

    const services = await Service.find(
      {
        uid,
      },
      "_id"
    );

    const serviceIDs = services.map((service) => service._id);

    const hiredServices = await HiredService.aggregate([
      {
        $match: {
          serviceID: {
            $in: serviceIDs,
          },
          isAcceptanceStatusUpdated: true,
          $or: [
            {
              isAccepted: true,
              isCompleted: true,
            },
            {
              isAccepted: false,
              isCompleted: false,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceID",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $lookup: {
          from: "members",
          localField: "memberID",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: "$member" },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      services: hiredServices,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetMyHiringHistory = async (req, res) => {
  try {
    const { uid } = req.query;

    const hiredServices = await HiredService.aggregate([
      {
        $match: {
          memberID: mongoose.Types.ObjectId(uid),
          isAcceptanceStatusUpdated: true,
          $or: [
            {
              isAccepted: true,
              isCompleted: true,
            },
            {
              isAccepted: false,
              isCompleted: false,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceID",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $lookup: {
          from: "members",
          localField: "memberID",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: "$member" },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      services: hiredServices,
    });
  } catch (e) {
    console.log(e);
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
          from: "rides",
          let: { driverID: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$driverID", "$$driverID"] },
                isActive: true,
              },
            },
          ],
          as: "ride",
        },
      },
      {
        $unwind: {
          path: "$ride",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    console.log("Drivers: ", drivers);
    return res.status(200).json({
      drivers,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetUpdatedTrack = async (req, res) => {
  try {
    const { rideID } = req.query;

    const ride = await Ride.findById(rideID).lean();

    return res.status(200).json({
      ride,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const RemoveNotificationToken = async (req, res) => {
  try {
    const { memberID, token } = req.body;

    if (token) {
      const member = await Member.findById(memberID);

      const newTokens = member.notificationToken.filter((t) => t !== token);
      member.notificationToken = newTokens;
      member.save();
    }

    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const GetHomeActiveOrders = async (req, res) => {
  try {
    const { uid } = req.query;

    const services = await Service.find(
      {
        uid,
      },
      "_id"
    );

    const serviceIDs = services.map((service) => service._id);

    const hiredServices = await HiredService.aggregate([
      {
        $match: {
          serviceID: {
            $in: serviceIDs,
          },
          isCompleted: false,
          $or: [
            { isAccepted: true, isAcceptanceStatusUpdated: true },
            { isAccepted: false, isAcceptanceStatusUpdated: false },
          ],
        },
      },
      { $limit: 5 },
      {
        $lookup: {
          from: "services",
          localField: "serviceID",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $lookup: {
          from: "members",
          localField: "memberID",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: "$member" },
    ]);

    return res.status(200).json({
      services: hiredServices,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};
