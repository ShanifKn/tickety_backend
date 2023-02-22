import agentModel from "../models/agentModel.js";
import busModel from "../models/busModel.js";
import { aisleSeat, avbseat, bookSeat, middleSeat, singleSeat, windowSeat } from "./BookingControllers.js";
import { getID } from "../middleware/authToken.js";
import mongoose from "mongoose";

// * FETCH BUS LIT *//
export const getBusList = async (req, res) => {
  try {
    const buses = await busModel.find();
    res.status(200).json({ buses: buses });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

//* GET AVAIABLE SEATS FROM AGENT HAVE *//
export const getAvaiable = async (req, res) => {
  try {
    let token = req.header("Authorization");
    const verified = getID(token);
    const { id } = verified;

    const seats = await agentModel.findById(id);
    const agent = seats.toObject();
    delete agent.password;

    res.status(200).json({ agent: agent });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

//* BOOKED SEATS *//
export const getBookedSeats = async (req, res) => {
  try {
    const { id } = req.query;
    const seats = await busModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }]);
    const seat = seats[0].seats;
    const bus = seats[0];
    res.status(200).json({ seats: seat, bus: bus });
  } catch (error) {
    res.status(500).json({error:"Internal Server Error"})
  }
};

//* BOOKING SEATS *//
export const addBooking = async (req, res) => {
  try {
    let token = req.header("Authorization");
    const verified = getID(token);
    const agentId = verified.id;
    const { passenger, id } = req.body;
    const bus = await busModel.findById(id);

    //* Sort the Array accordingally Femala and age *//
    passenger.sort((a, b) => {
      if (a.sex === "Female" && b.sex !== "Female") {
        return -1;
      } else if (b.sex === "Female" && a.sex !== "Female") {
        return 1;
      } else {
        return b.age - a.age;
      }
    });

    if (passenger.length <= 1 && passenger[0].age < 60) {
      let a = 0;
      let Booked = 0;
      for (let i = 0; i < bus.row; i++) {
        Booked = await singleSeat(passenger, id, i, agentId);
        if (Booked) break;
      }
      if (!Booked) {
        for (let i = 0; i < bus.row; i++) {
          const AVAIABLEseat = await avbseat(passenger, id, i, agentId);
          if (AVAIABLEseat) {
            res.status(302).json({ msg: "Booking full" });
            break;
          }
        }
      }
    } else {
      let a = 0;
      let b = 0;
      let c = 0;
      for (let i = 0; i < passenger.length; i++) {
        if (passenger[i].age >= 60) {
          const booked = await windowSeat(passenger[i], id, a, agentId);
          if (booked) continue;
          else if (!booked && a < bus.row) {
            a++;
            i--;
          } else if (a >= bus.row) {
            const booked = await middleSeat(passenger[i], id, b, agentId);
            if (booked) continue;
            else if (!booked && b < bus.row) {
              b++;
              i--;
            } else if (b >= bus.row) {
              const booked = await aisleSeat(passenger[i], id, c, agentId);
              if (booked) continue;
              else if (!booked && c < bus.row) {
                c++;
                i--;
              } else if (c >= bus.row) return res.status(302).json({ msg: "Booking Full" });
            }
          }
        } else {
          const booked = await bookSeat(passenger[i], id, a, agentId);
          if (booked) continue;
          else if (!booked && a < bus.row) {
            a++;
            i--;
          } else {
            res.status(302).json({ msg: "Booking Full" });
          }
        }
      }
    }
    res.status(200).json({ msg: "Booking Successful" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};
