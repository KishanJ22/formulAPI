import { describe, expect, test } from 'vitest';
import axios, { AxiosResponse } from "axios";

describe("Driver Integration Tests", () => {

    const driversAxios = axios.create({
      baseURL: "http://localhost:3000",
    });
  
    test("Status of response when calling /drivers endpoint must be 200", async () => {
      const response: AxiosResponse = await driversAxios.get("/drivers");
      expect(response.status).toEqual(200);
    });
  
    test("Get all drivers", async () => {
      const response: AxiosResponse = await driversAxios.get("/drivers");
      const data = response.data;
      const expectedDrivers = [
        { id: "lewis-hamilton", name: "Lewis Hamilton", firstName: "Lewis", lastName: "Hamilton", fullName: "Lewis Carl Davidson Hamilton", abbreviation: "HAM", permanentNumber: "44", gender: "MALE", dateOfBirth: "1985-01-07", dateOfDeath: null, placeOfBirth: "Stevenage", countryOfBirthId: "united-kingdom", nationalityCountryId: "united-kingdom", secondNationalityCountryId: null, bestChampionshipPosition: 1, bestStartingGridPosition: 1, bestRaceResult: 1, championshipWins: 7, raceEntries: 346, raceStarts: 346, raceWins: 105, raceLaps: 19751, podiums: 201, totalPoints: "4789.5", totalChampionshipPoints: "4789.5", polePositions: 104, fastestLaps: 67, totalDriverOfTheDay: 16, grandSlams: 6},
        { id: 'ayumu-iwasa', name: 'Ayumu Iwasa', firstName: 'Ayumu', lastName: 'Iwasa', fullName: 'Ayumu Iwasa', abbreviation: 'IWA', permanentNumber: null, gender: 'MALE',dateOfBirth: '2001-09-22', dateOfDeath: null, placeOfBirth: 'Moriguchi', countryOfBirthId: 'japan', nationalityCountryId: 'japan', secondNationalityCountryId: null, bestChampionshipPosition: null, bestStartingGridPosition: null, bestRaceResult: null, championshipWins: 0, raceEntries: 0, raceStarts: 0, raceWins: 0, raceLaps: 0, podiums: 0, totalPoints: "0", totalChampionshipPoints: "0", polePositions: 0, fastestLaps: 0, totalDriverOfTheDay: 0, grandSlams: 0 },
      ]
      expect(response.data).toEqual(expect.arrayContaining(expectedDrivers));
    });
  
    test("Get one driver", async () => {
      const response: AxiosResponse = await driversAxios.get("/drivers/lewis-hamilton");
      expect(response.data).toEqual({ id: "lewis-hamilton", name: "Lewis Hamilton", firstName: "Lewis", lastName: "Hamilton", fullName: "Lewis Carl Davidson Hamilton", abbreviation: "HAM", permanentNumber: "44", gender: "MALE", dateOfBirth: "1985-01-07", dateOfDeath: null, placeOfBirth: "Stevenage", countryOfBirthId: "united-kingdom", nationalityCountryId: "united-kingdom", secondNationalityCountryId: null, bestChampionshipPosition: 1, bestStartingGridPosition: 1, bestRaceResult: 1, championshipWins: 7, raceEntries: 346, raceStarts: 346, raceWins: 105, raceLaps: 19751, podiums: 201, totalPoints: "4789.5", totalChampionshipPoints: "4789.5", polePositions: 104, fastestLaps: 67, totalDriverOfTheDay: 16, grandSlams: 6});
    });
  });