import axios from "axios"
import dayjs from "dayjs"
import dotenv from "dotenv";

import { asyncMap } from "../../helpers"
import { get as flightGetters, set as flightSetters } from "./helpers"
import { get as aircraftGetters, set as aircraftSetters } from "../aircrafts/helpers"
import { get as userGetters } from "../users/helpers"

import { FlightAggregations } from "../../aggregations/FlightAggregations"

dotenv.config();

export const SearchFlightsbyFlightNumber = async(req, res) => {
  const { flightNumber, flightDate } = req.body

  try{
    const flightDateDayJsObject = await flightGetters.flightDateDayJsObject({ flightDate })

    const flightsForFlightNumberOnFlightDate = await flightGetters.flightsOnFlightDateWithIdent({ flightIdent: flightNumber, flightDate: flightDateDayJsObject })

    res.send(flightsForFlightNumberOnFlightDate)

  } catch(e){
    res.send(e)
  }
}

export const SearchFlightsByRegistration = async(req, res) => {
  const { registrationNumber, flightDate } = req.body

  try{
    const aircraftOnDb = await aircraftGetters.aircraft({ aircraftRegistration: registrationNumber })

    const flightDateDayJsObject = await flightGetters.flightDateDayJsObject({ flightDate })
    const flightsForRegistrationOnFlightDate = await flightGetters.flightsOnFlightDateWithIdent({ flightIdent: registrationNumber, flightDate: flightDateDayJsObject })

    // Add the aircraft to the database if there is a result
    if(flightsForRegistrationOnFlightDate.length && aircraftOnDb === null){
      const aircraftDetails = flightsForRegistrationOnFlightDate.pop()
      const SavedAircraft = await aircraftSetters.createAircraft({ aircraftRegistration: aircraftDetails.aircraftRegistration, aircraftType: aircraftDetails.aircraftType, airlineICAO: aircraftDetails.airlineICAO })
    }
    res.send(flightsForRegistrationOnFlightDate)
  } catch(e){
    res.send(e)
  }
}

export const AddFlightToUserAccount = async(req, res) => {
  const { userId, flightInformation, fromApi } = req.body

  try{
    const UserFlight = await flightSetters.addUserFlight({ userId, userFlight: flightInformation, fromApi })
    res.send(UserFlight)
  } catch(e){
    res.send(e)
  }
}

export const FlightsDetailsForUser = async (req, res) => {
  const { userId } = req.body

  try {
    const FlightsForUser = await FlightAggregations.getAllUserFlightsAllDetailsAggregation({ userId })
    res.send(FlightsForUser)
  } catch(e){
    res.send(e)
  }
}
