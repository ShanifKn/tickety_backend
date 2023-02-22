import mongoose from "mongoose";
import busModel from "../models/busModel.js";

export const windowSeat = async (passenger, id, a, agentId) => {
  const windowSeat = await busModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        [`seats.row${a}`]: {
          $filter: {
            input: `$seats.row${a}`,
            cond: { $and: [{ $eq: ["$$this.seat_type", "Window"] }, { $eq: ["$$this.booking", false] }] },
          },
        },
      },
    },
  ]);

  if (windowSeat[0].seats[`row${a}`]?.length) {
    const seatNumber = windowSeat[0].seats[`row${a}`][0].seatNumber;
    await busModel.updateOne(
      { _id: id, [`seats.row${a}`]: { $elemMatch: { seatNumber: seatNumber } } },
      {
        $set: {
          [`seats.row${a}.$[seat].booking`]: true,
          [`seats.row${a}.$[seat].passenger_name`]: passenger.name,
          [`seats.row${a}.$[seat].age`]: passenger.age,
          [`seats.row${a}.$[seat].gender`]: passenger.sex,
          [`seats.row${a}.$[seat].agent`]: agentId,
        },
      },
      { arrayFilters: [{ "seat.seatNumber": seatNumber }] }
    );
    return true;
  } else {
    return false;
  }
};
export const middleSeat = async (passenger, id, a, agentId) => {
  const middleSeat = await busModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        [`seats.row${a}`]: {
          $filter: {
            input: `$seats.row${a}`,
            cond: { $and: [{ $eq: ["$$this.seat_type", "Middle"] }, { $eq: ["$$this.booking", false] }] },
          },
        },
      },
    },
  ]);
  if (middleSeat[0].seats[`row${a}`]?.length) {
    const seatNumber = middleSeat[0].seats[`row${a}`][0].seatNumber;
    await busModel.updateOne(
      { _id: id, [`seats.row${a}`]: { $elemMatch: { seatNumber: seatNumber } } },
      {
        $set: {
          [`seats.row${a}.$[seat].booking`]: true,
          [`seats.row${a}.$[seat].passenger_name`]: passenger.name,
          [`seats.row${a}.$[seat].age`]: passenger.age,
          [`seats.row${a}.$[seat].gender`]: passenger.sex,
          [`seats.row${a}.$[seat].agent`]: agentId,
        },
      },
      { arrayFilters: [{ "seat.seatNumber": seatNumber }] }
    );
    return true;
  } else {
    return false;
  }
};

export const aisleSeat = async (passenger, id, a, agentId) => {
  const aisleSeat = await busModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        [`seats.row${a}`]: {
          $filter: {
            input: `$seats.row${a}`,
            cond: { $and: [{ $eq: ["$$this.seat_type", "Aisle"] }, { $eq: ["$$this.booking", false] }] },
          },
        },
      },
    },
  ]);
  if (aisleSeat[0].seats[`row${a}`]?.length) {
    const seatNumber = aisleSeat[0].seats[`row${a}`][0].seatNumber;
    await busModel.updateOne(
      { _id: id, [`seats.row${a}`]: { $elemMatch: { seatNumber: seatNumber } } },
      {
        $set: {
          [`seats.row${a}.$[seat].booking`]: true,
          [`seats.row${a}.$[seat].passenger_name`]: passenger.name,
          [`seats.row${a}.$[seat].age`]: passenger.age,
          [`seats.row${a}.$[seat].gender`]: passenger.sex,
          [`seats.row${a}.$[seat].agent`]: agentId,
        },
      },
      { arrayFilters: [{ "seat.seatNumber": seatNumber }] }
    );
    return true;
  } else {
    return false;
  }
};

export const bookSeat = async (passenger, id, a, agentId) => {
  const Seat = await busModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        [`seats.row${a}`]: {
          $filter: {
            input: `$seats.row${a}`,
            cond: { $eq: ["$$this.booking", false] },
          },
        },
      },
    },
  ]);
  if (Seat[0].seats[`row${a}`]?.length) {
    const seatNumber = Seat[0].seats[`row${a}`][0].seatNumber;
    await busModel.updateOne(
      { _id: id, [`seats.row${a}`]: { $elemMatch: { seatNumber: seatNumber } } },
      {
        $set: {
          [`seats.row${a}.$[seat].booking`]: true,
          [`seats.row${a}.$[seat].passenger_name`]: passenger.name,
          [`seats.row${a}.$[seat].age`]: passenger.age,
          [`seats.row${a}.$[seat].gender`]: passenger.sex,
          [`seats.row${a}.$[seat].agent`]: agentId,
        },
      },
      { arrayFilters: [{ "seat.seatNumber": seatNumber }] }
    );
    return true;
  } else {
    return false;
  }
};

export const singleSeat = async (passenger, id, a, agentId) => {
  const Seat = await busModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        [`seats.row${a}`]: {
          $filter: {
            input: `$seats.row${a}`,
            cond: { $eq: ["$$this.booking", false] },
          },
        },
      },
    },
  ]);
  const NoofSeats = Seat[0].seats[`row${a}`].length;
  let sex = "Male";

  for (let i = 0; i < NoofSeats; i++) {
    let ID = Seat[0].seats[`row${a}`][i].id;

    ID++;

    if (passenger[0].sex == "Male") {
      sex = "Female";
    }
    let user = null;
    if (ID <= 5) {
      user = await busModel.findOne({ _id: id, [`seats.row${a}`]: { $elemMatch: { $and: [{ id: ID }, { gender: sex }] } } });
    }
    if (user) {
      continue;
    } else {
      let ID = Seat[0].seats[`row${a}`][i].id;
      ID--;
      if (ID >= 0) {
        const user = await busModel.findOne({ _id: id, [`seats.row${a}`]: { $elemMatch: { $and: [{ id: ID }, { gender: sex }] } } });
        if (user) {
          continue;
        } else {
          let ID = Seat[0].seats[`row${a}`][i].id;
          await busModel.updateOne(
            { _id: id, [`seats.row${a}`]: { $elemMatch: { id: ID } } },
            {
              $set: {
                [`seats.row${a}.$[seat].booking`]: true,
                [`seats.row${a}.$[seat].passenger_name`]: passenger[0].name,
                [`seats.row${a}.$[seat].age`]: passenger[0].age,
                [`seats.row${a}.$[seat].gender`]: passenger[0].sex,
                [`seats.row${a}.$[seat].agent`]: agentId,
              },
            },
            { arrayFilters: [{ "seat.id": ID }] }
          );
          return true;
        }
      }
    }
    // if()
  }
  return false;
};

export const avbseat = async (passenger, id, a, agentId) => {
  const Seat = await busModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        [`seats.row${a}`]: {
          $filter: {
            input: `$seats.row${a}`,
            cond: { $eq: ["$$this.booking", false] },
          },
        },
      },
    },
  ]);

  if (Seat[0].seats[`row${a}`].length) {
    const seatNumber = Seat[0].seats[`row${a}`][0].seatNumber;
    await busModel.updateOne(
      { _id: id, [`seats.row${a}`]: { $elemMatch: { seatNumber: seatNumber } } },
      {
        $set: {
          [`seats.row${a}.$[seat].booking`]: true,
          [`seats.row${a}.$[seat].passenger_name`]: passenger[0].name,
          [`seats.row${a}.$[seat].age`]: passenger[0].age,
          [`seats.row${a}.$[seat].gender`]: passenger[0].sex,
          [`seats.row${a}.$[seat].agent`]: agentId,
        },
      },
      { arrayFilters: [{ "seat.seatNumber": seatNumber }] }
    );
    return true;
  } else {
    return false;
  }
};
