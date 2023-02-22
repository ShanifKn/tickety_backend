import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 5,
    },
    verficationCode: {
      type: Number,
    },
    approvalStatus: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
      min: 10,
      max: 10,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    profile: {
      type: String,
    },
    seats: {
      type: Number,
    },
  },
  { timestamps: true }
);

const agentModel = mongoose.model("agent", agentSchema);
export default agentModel;
