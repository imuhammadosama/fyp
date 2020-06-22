import User from "../models/user.model";
import Worker from "../models/worker.model";
import Service from "../models/service.model";
import { v4 as uuidv4 } from "uuid";
import * as _ from "lodash";
import HiredService from "../models/hired-services.model";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

export const AddWorker = async (req, res) => {
  try {
    const { name, mobile, username, password } = req.body;

    const numArray = [mobile];

    if (mobile.startsWith("0")) {
      numArray.push(`+92${mobile.substring(1)}`);
    } else if (mobile.startsWith("+92")) {
      numArray.push(`0${mobile.substring(3)}`);
    }

    const m = await Worker.findOne({ mobile: { $in: numArray } }).lean();
    if (m)
      throw new Error(`Worker with mobile number ${mobile} already exist!`);

    const passwordHash = bcrypt.hashSync(password);

    const user = new User({
      username,
      password: passwordHash,
      role: "Worker",
    });

    user.save(async (err, user) => {
      if (err) {
        return res.status(500).json({
          message: `Worker with username ${username} already exists!`,
        });
      }
      const worker = new Worker({
        uid: user._id,
        name,
        mobile,
      });
      await worker.save();
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

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
    }).lean();

    if (!user) throw new Error("Invalid Credentials!");

    const worker = await Worker.findOne({
      uid: user._id,
    }).lean();

    if (!worker) throw new Error("Invalid Credentials!");

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) throw new Error("Invalid Credentials!");

    const work = {
      ...worker,
      username: user.username,
    };

    const token = jwt.sign(work, process.env.JWT_SECRET);

    return res.status(200).json({
      auth: {
        user: work,
        token,
        role: "worker",
      },
    });
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
        $project: {
          name: "$name",
          mobile: "$mobile",
          uid: "$uid",
          username: "$user.username",
        },
      },
    ]);
    return res.status(200).json({
      workers,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const UpdateWorker = async (req, res) => {
  try {
    const { _id, name, mobile } = req.body;

    await Worker.findByIdAndUpdate(_id, {
      name,
      mobile,
    });

    return res.status(200).json({
      updated: true,
    });
  } catch (e) {
    if (e.codeName === "DuplicateKey" && e.keyValue.mobile)
      return res.status(500).json({
        message: `Worker with mobile number ${req.body.mobile} already exists!`,
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

export const DeleteWorker = async (req, res) => {
  try {
    const { _id, username } = req.body;

    await User.remove({
      username,
    });

    await Worker.remove({
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
    const { uid } = req.query;

    const services = await Service.find({ uid, isDeleted: false });

    const grouped = _.groupBy(services, "category");

    return res.status(200).json({
      services: grouped,
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
