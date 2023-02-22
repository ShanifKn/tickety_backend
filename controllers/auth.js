import agentModel from "../models/agentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

const adminCredentials = JSON.parse(fs.readFileSync("adminCredentials.json"));

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminCredentials.find((admin) => admin.email === email);
    if (!admin) return res.status(400).json({ error: " Invalid credentials." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect Password." });
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);

    res.status(200).json({ token, admin });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// * Agent Registration *//
export const agentRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, city, address, phone } = req.body;
    const image = req.file.location;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const agent = await agentModel.findOne({ email: email });

    if (!agent) return res.status(404).send({ msg: "Use your registrated email address" });

    await agentModel.updateOne(
      { email: email },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          password: hashedPassword,
          phone: phone,
          city: city,
          address: address,
          profile: image,
        },
      }
    );
    return res.status(200).json({ msg: "New agent added" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

//* Agent login *//

export const agentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const agent = await agentModel.findOne({ email: email });
    if (!agent) return res.status(400).json({ error: " Invalid email address." });
    if (agent.approvalStatus === "false") return res.status(400).json({ error: "Still Pending for approval." });

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect Password." });
    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET);

    // * prevent password *//
    let Agent = agent.toObject();
    delete Agent.password;

    res.status(200).json({ token, Agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
