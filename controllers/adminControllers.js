import * as dotenv from "dotenv";
dotenv.config();
import agentModel from "../models/agentModel.js";
import nodemailer from "nodemailer";
import busModel from "../models/busModel.js";

// * CODE GENERATOR *//
const generateVerficationCode = () => {
  return Math.floor(500000 + Math.random() * 5000000);
};

// * NODE MAILER CONFIGURATION *//
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// * INVITIATION *//
export const inviteAgent = async (req, res) => {
  try {
    const { email, name } = req.body;
    const agentFind = await agentModel.findOne({ email: email });
    if (agentFind) return res.status(404).json({ msg: "user already exist" });
    // * SEND MAIL *//
    const generateCode = generateVerficationCode();
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Invitation to join  tickety",
      html: `Hello ${name},<br><br>
      You have been invited to join tickety as an agent. Please click on the following link to verify your account and create a password:<br><br>
      <a href="${process.env.VERIFY_URL}/verify-token/${generateCode}">Verify Account</a><br><br>
      Best regards,<br>
      Tickety Team`,
    };
    await transporter.sendMail(mailOptions);

    /* CREATEING NEW USER */
    const agent = new agentModel({
      email,
      verficationCode: generateCode,
    });
    await agent.save();
    res.status(200).json({ msg: "New invitation was created successfully" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// * VERFIY CODE *//
export const verifyMail = async (req, res) => {
  try {
    const { generateCode } = req.params;
    const agent = await agentModel.findOne({ verficationCode: generateCode });
    if (!agent) return res.status(404).send({ message: "Invalid token" });
    await agentModel.updateOne(
      { email: agent.email },
      {
        $set: { approvalStatus: true },
      }
    );
    res.redirect(`${process.env.SIGNUP_URL}`);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

//* AGENT LIST *//
export const agentList = async (req, res) => {
  try {
    const agentList = await agentModel.aggregate([
      {
        $match: {
          approvalStatus: true,
        },
      },
    ]);
    res.status(200).json({ agents: agentList });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// * ADD NEW  BUS *//
export const addBus = async (req, res) => {
  try {
    const { start, drop, rows } = req.body;

    // * seat arragement *//
    const seats = {};
    const columns = 6;
    let cm = 1,
      cw = 1,
      ca = 1;

    for (let i = 0; i < rows; i++) {
      seats[`row${i}`] = [];
      for (let j = 0; j < columns; j++) {
        if (j === 0 || j === columns - 1) {
          // window seat
          seats[`row${i}`][j] = {
            id: j,
            booking: false,
            seatNumber: `W${cw}`,
            seat_type: "Window",
            passenger_name: null,
            age: null,
            gender: null,
            agent: null,
          };
          cw++;
        } else if (j === 1 || j === columns - 2) {
          // middle seat
          seats[`row${i}`][j] = {
            id: j,
            booking: false,
            seatNumber: `M${cm}`,
            seat_type: "Middle",
            passenger_name: null,
            age: null,
            gender: null,
            agent: null,
          };
          cm++;
        } else {
          // aisle seat
          seats[`row${i}`][j] = {
            id: j,
            booking: false,
            seatNumber: `A${ca}`,
            seat_type: "Aisle",
            passenger_name: null,
            age: null,
            gender: null,
            agent: null,
          };
          ca++;
        }
      }
    }

    const newBus = new busModel({
      start_location: start,
      drop_location: drop,
      row: rows,
      seats: seats,
    });
    await newBus.save();

    res.status(200).json({ msg: "New Bus added to list" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

//* ASSIGN SEATS  *//
export const seatAsign = async (req, res) => {
  try {
    const { id, seats } = req.body;

    const agent = await agentModel.findById(id);
    if (!agent) return res.status(400).json({ msg: "Invalid agent" });

    await agentModel.updateOne(
      { _id: id },
      {
        $set: { seats: seats },
      }
    );

    res.status(200).json({ msg: "Seats updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};
