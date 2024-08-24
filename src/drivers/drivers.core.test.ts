import {Driver, getAllDrivers, getOneDriver} from "./drivers.core";
import { describe, expect, test, vi } from 'vitest';
import * as driversModel from "./drivers.model";

const mockedDrivers = vi.spyOn(driversModel, "getDriversFromDb");

describe("/drivers GET Unit Tests", () => {
    test("Get all drivers", async () => {
        mockedDrivers.mockResolvedValueOnce([
          ["lewis-hamilton", "Lewis Hamilton","Lewis", "Hamilton", "Lewis Carl Davidson Hamilton", "HAM", "44", "MALE", "1985-01-07", null, "Stevenage", "united-kingdom", "united-kingdom", null, 1, 1, 1, 7, 346, 346, 105, 19751, 201, "4789.5", "4789.5", 104, 67, 16, 6],
          ['ayumu-iwasa', 'Ayumu Iwasa', 'Ayumu', 'Iwasa', 'Ayumu Iwasa', 'IWA', null, 'MALE', '2001-09-22', null, 'Moriguchi', 'japan', 'japan', null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          ['bas-leinders', 'Bas Leinders', 'Bas', 'Leinders', 'Bas Leinders', 'LEI', null, 'MALE', '1975-07-16', null, 'Bree', 'belgium', 'belgium', null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]);
        const drivers = await getAllDrivers();
        const expectedDrivers = [
          { id: "lewis-hamilton", name: "Lewis Hamilton", firstName: "Lewis", lastName: "Hamilton", fullName: "Lewis Carl Davidson Hamilton", abbreviation: "HAM", permanentNumber: "44", gender: "MALE", dateOfBirth: "1985-01-07", dateOfDeath: null, placeOfBirth: "Stevenage", countryOfBirthId: "united-kingdom", nationalityCountryId: "united-kingdom", secondNationalityCountryId: null, bestChampionshipPosition: 1, bestStartingGridPosition: 1, bestRaceResult: 1, championshipWins: 7, raceEntries: 346, raceStarts: 346, raceWins: 105, raceLaps: 19751, podiums: 201, totalPoints: "4789.5", totalChampionshipPoints: "4789.5", polePositions: 104, fastestLaps: 67, totalDriverOfTheDay: 16, grandSlams: 6},
          { id: 'ayumu-iwasa', name: 'Ayumu Iwasa', firstName: 'Ayumu', lastName: 'Iwasa', fullName: 'Ayumu Iwasa', abbreviation: 'IWA', permanentNumber: null, gender: 'MALE',dateOfBirth: '2001-09-22', dateOfDeath: null, placeOfBirth: 'Moriguchi', countryOfBirthId: 'japan', nationalityCountryId: 'japan', secondNationalityCountryId: null, bestChampionshipPosition: null, bestStartingGridPosition: null, bestRaceResult: null, championshipWins: 0, raceEntries: 0, raceStarts: 0, raceWins: 0, raceLaps: 0, podiums: 0, totalPoints: 0, totalChampionshipPoints: 0, polePositions: 0, fastestLaps: 0, totalDriverOfTheDay: 0, grandSlams: 0 },
          { id: 'bas-leinders', name: 'Bas Leinders', firstName: 'Bas', lastName: 'Leinders', fullName: 'Bas Leinders', abbreviation: 'LEI', permanentNumber: null, gender: 'MALE', dateOfBirth: '1975-07-16', dateOfDeath: null, placeOfBirth: 'Bree', countryOfBirthId: 'belgium', nationalityCountryId: 'belgium', secondNationalityCountryId: null, bestChampionshipPosition: null, bestStartingGridPosition: null, bestRaceResult: null, championshipWins: 0, raceEntries: 0, raceStarts: 0, raceWins: 0, raceLaps: 0, podiums: 0, totalPoints: 0, totalChampionshipPoints: 0, polePositions: 0, fastestLaps: 0, totalDriverOfTheDay: 0, grandSlams: 0 },
        ];
        expect(drivers).toEqual(expect.arrayContaining(expectedDrivers));
    });

    test("Get one driver", async () => {
        mockedDrivers.mockResolvedValueOnce([
          ["lewis-hamilton", "Lewis Hamilton","Lewis", "Hamilton", "Lewis Carl Davidson Hamilton", "HAM", "44", "MALE", "1985-01-07", null, "Stevenage", "united-kingdom", "united-kingdom", null, 1, 1, 1, 7, 346, 346, 105, 19751, 201, "4789.5", "4789.5", 104, 67, 16, 6]
        ]);
        expect(await getOneDriver("lewis-hamilton")).toEqual({ id: "lewis-hamilton", name: "Lewis Hamilton", firstName: "Lewis", lastName: "Hamilton", fullName: "Lewis Carl Davidson Hamilton", abbreviation: "HAM", permanentNumber: "44", gender: "MALE", dateOfBirth: "1985-01-07", dateOfDeath: null, placeOfBirth: "Stevenage", countryOfBirthId: "united-kingdom", nationalityCountryId: "united-kingdom", secondNationalityCountryId: null, bestChampionshipPosition: 1, bestStartingGridPosition: 1, bestRaceResult: 1, championshipWins: 7, raceEntries: 346, raceStarts: 346, raceWins: 105, raceLaps: 19751, podiums: 201, totalPoints: "4789.5", totalChampionshipPoints: "4789.5", polePositions: 104, fastestLaps: 67, totalDriverOfTheDay: 16, grandSlams: 6});
    });

    test("Error is thrown when driver is not found", async () => {
        await expect(getOneDriver("kimi-antonelli")).rejects.toThrow("Driver not found");
    });
});