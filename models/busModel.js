import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  start_location: {
    type: String,
    required: true,
  },
  drop_location: {
    type: String,
    required: true,
  },
  row: {
    type: Number,
  },
  seats: {},
});

const busModel = mongoose.model("Bus", busSchema);
export default busModel;
