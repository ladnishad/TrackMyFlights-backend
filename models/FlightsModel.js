import mongoose from "mongoose"
import dayjs from "dayjs";

const { Schema, model } = mongoose

const FlightsSchema = new Schema({
  _id: String,
  userId: {
    type: String,
    required: true
  },
  airlineId: {
    type: String,
    required: true
  },
  aircraftId: {
    type: String,
    required: true
  },
  flightNumber: {
    type: String,
    default: ""
  },
  flightDate: {
    type: Number,
    default: 0
  },
  flightOriginAirportId: {
    type: String,
    default: ""
  },
  flightDestinationAirportId: {
    type: String,
    default: ""
  },
  caption: {
    type: String,
    default: ""
  },
  visibility: {
    type: String,
    enum: ["Private", "Friends", "Public"],
    default: "Private"
  }
})

FlightsSchema.pre("save", async function(next) {
  const _id = mongoose.Types.ObjectId()
  this._id = _id
  
  next()
})

export const Flight = model("Flights", FlightsSchema)
