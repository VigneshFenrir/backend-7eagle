const express = require("express");
router = express.Router();
const UserModel = require("../models/user");
const nodemailer = require("nodemailer");

const smtpConfig = {
  host: "smtp.hostinger.com", // Replace with your actual SMTP server hostname
  port: 465, // Common port for secure SMTP (SSL/TLS)
  secure: true, // Use secure connection
  auth: {
    user: "academy@hilltotown.com", // Replace with your SMTP username
    pass: "Academy@2024!", // Replace with your SMTP password
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

// to request & response to the api and database /  forget password find the email and generate otp
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const forgetpwd = await UserModel.findOne({ email });
    if (!forgetpwd) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Mail Id" });
    }
    const generateOTP = () => {
      const otps = Math.floor(100000 + Math.random() * 900000);
      return otps.toString();
    };
    const otp = generateOTP();
    forgetpwd.otp = otp;
    console.log("Generated OTP:", otp);
    const mailOptions = {
      from: "academy@hilltotown.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `<p>Your OTP for password reset is: ${otp}
        Please use this OTP to reset your password.`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    const forget = await forgetpwd.save();
    console.log(forget);
    const resp = {
      success: true,
      email: forgetpwd.email,
    };

    res.send(resp);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

// to request & response to the api and database /  verify otp

router.post("/verifyotp", async (req, res) => {
  const { otp } = req.body;
  try {
    const verifyOtp = await UserModel.findOne({ otp });
    if (!verifyOtp) {
      return res.status(400).send({ success: false, message: "Invalid OTP" });
    }
    const resp = {
      success: true,
      userid: verifyOtp._id,
    };
    res.send(resp);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

router.put("/updatepassword/:id", async (req, res) => {
  try {
    const { password, confirm_password } = req.body;
    const id = req.params.id;
    if (password !== confirm_password) {
      return res.status(400).json("Passwords do not match");
    }
    const updatepPassword = await UserModel.findByIdAndUpdate(
      id,
      {
        password: req.body.password,
      },
      { new: true }
    );
    console.log(updatepPassword);
    if (!updatepPassword) return res.status(400).send("error");
    res.send("Password Updated Successfully");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
