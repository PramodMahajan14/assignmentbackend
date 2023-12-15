const route = require("express").Router();
const { task, users } = require("../models/taskmodel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/auth");
const { sendEMail, dateToSendEMail } = require("../MailService/Mail");
const moment = require("moment-timezone");
const newJobs = require("../MailService/jobsStore");
// =============================Routes======================

route.get("/", async (req, res) => {
  res.send("Hii Task Management");
});
route.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(req.body);
    const userId = uuidv4(); //used for generation og userId

    //regex for valid email
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(email)) {
      return res.status(401).json({ msg: "Invalid Email" });
    }

    let data = await users.findOne({ email: email });

    if (data) {
      return res.status(400).json({ msg: "This Email has already been taken" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let newUser = new users({
      name,
      email,
      password: passwordHash,
      isVerified: false,
      userId: userId,
    });

    await newUser.save();

    // send verification Email
    const link = `${process.env.SERVER_URL}/v1/api/auth/verify/${userId}`;

    sendEMail(email, name, link, userId);
    return res.status(200).json({
      msg: "sucessYour Registration was Successfully and Please check your email account to verify",
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
});

// Verify Email
route.get("/auth/verify/:id", async (req, res) => {
  const userId = req.params.id;
  // console.log(userId);

  try {
    const data = await users.findOne({ userId });

    // console.log(data.Item);
    if (!data) {
      return res.status(401).json({ msg: "First register yourself" });
    }

    // update status
    const userData = await users.updateOne(
      { userId },
      { $set: { isVerified: true } }
    );
    // return res.json({ msg: "verified" });
    //  redirect to Client side for show verification is done
    return res.redirect(`${process.env.CLIENT_URL}/successfulVerified`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }
});

route.post("/signin", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    // console.log(req.body);
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(Email)) {
      return res.status(401).json({ msg: "Invalid Email" });
    }

    let data = await users.findOne({ email: Email });
    // console.log(data);
    if (!data) {
      return res.status(401).json({ msg: "User not exist" });
    }

    const isMatch = await bcrypt.compare(Password, data.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Password is incorrect." });

    console.log(data.isVerified);
    if (!data.isVerified) {
      return res.status(401).json({ msg: "Email not verified." });
    }

    //jwt token generation
    const token = createRefreshToken({ id: data._id });

    res.cookie("task", token, {
      // path: "/user/refresh_token",
      path: "http://localhost:3000",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: false,
    });

    const today = new Date();
    let formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
    });

    let usDate = formatter.format(today);

    let dateArray = usDate.split("/");

    const time = today.toLocaleString("en-IN", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    const fullDate = `${dateArray[1]}-${dateArray[0]}-${dateArray[2]}, ${time}`;
    // let lastLoggedIn;

    // if (data.currentLogin == null) {
    //   lastLoggedIn = fullDate;
    // } else {
    //   lastLoggedIn = data.currentLogin;
    // }
    // console.log(token);
    return res.status(200).json({
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

route.get("/access", async (req, res) => {
  try {
    // console.log(token);
    const token = req.header("Authorization");

    if (!token) return res.status(400).json({ msg: "Please SignUp Now!" });
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Please SignUp now!" });
      console.log(user);

      const access_token = createAccessToken({ id: user.id });

      return res.status(200).json({ access_token });
    });
  } catch (err) {
    return res.status(500).json({ msg: "server Error" });
  }
});

route.get("/profile", auth, async (req, res) => {
  try {
    const user = await users.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: "server Error" });
  }
});

// =====================Task Manage============================

route.post("/newtask/:userId", async (req, res) => {
  try {
    const { title, description, dateToSend } = req.body;
    console.log(req.body);
    console.log(req.params.userId);
    let data = await users.findOne({ userId: req.params.userId });

    let newTask = new task({
      title,
      description,
      userId: req.params.userId,
    });
    // if user has set Time
    if (dateToSend) {
      // const inputDate = "23-10-2023 12:50 AM"; //Date must  have this format

      await newTask.save();

      newJobs(ISOTimeDate(dateToSend), title, data.email, data.name);

      await dateToSendEMail(
        data.email,
        data.name,
        title,
        ISOTimeDate(dateToSend),
        dateToSend
      );
      return res.status(200).json({ msg: "Task Add successfully" });
    }

    await newTask.save();
    // console.log(newTask);
    return res.status(200).json({ msg: "Task Add successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

route.get("/tasks/:userId", async (req, res) => {
  try {
    let data = await task.find({ userId: req.params.userId }).limit(10);
    // console.log("Data ==> ", data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ msg: "server Error" });
  }
});

route.get("/task/:id", async (req, res) => {
  try {
    let data = await task.findById({ _id: req.params.id });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ msg: "server Error" });
  }
});

route.post("/updatetask/:id/:userId", async (req, res) => {
  try {
    const { title, description, dateToSend } = req.body;
    console.log(req.body);
    console.log("ok1");
    let data = await users.findOne({ userId: req.params.userId });
    console.log(data);
    if (!data) {
      return res.status(404).json({ msg: "Something wrong" });
    }

    if (dateToSend) {
      // const inputDate = "23-10-2023 12:50 AM"; //Date must  have this format
      await task.findOneAndUpdate(
        { _id: req.params.id },
        { title, description, status }
      );

      await dateToSendEMail(
        data.email,
        data.name,
        title,
        ISOTimeDate(dateToSend),
        dateToSend
      );

      return res.status(200).json({ msg: "Task Update successfully" });
    }

    await task.findOneAndUpdate({ _id: req.params.id }, { title, description });

    return res.status(200).json({ msg: "Task Update successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "server Error" });
  }
});

route.delete("/removetask/:id", async (req, res) => {
  try {
    await task.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).json({ msg: "Task Delete successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "server Error" });
  }
});

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const ISOTimeDate = (localzoneTime) => {
  const timeZone = "Asia/Kolkata";

  const dateTime = moment(localzoneTime, "DD-MM-YYYY hh:mm A");

  const dateTimeInTimeZone = dateTime.tz(timeZone);
  return dateTimeInTimeZone.format();
};
module.exports = route;
