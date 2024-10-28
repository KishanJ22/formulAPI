import { getAllDrivers, getOneDriver} from "./drivers.core";
import { describe, expect, test, vi } from 'vitest';
import prisma from "../__mocks__/prisma";
import { Decimal } from "@prisma/client/runtime/library";

vi.mock('../db');

describe.skip("/drivers GET Unit Tests", () => {
    test("Get all drivers", async () => {
        const value = [
          {
            id: "lewis-hamilton",
            name: "Lewis Hamilton",
            first_name: "Lewis",
            last_name: "Hamilton",
            full_name: "Lewis Carl Davidson Hamilton",
            abbreviation: "HAM",
            permanent_number: "44",
            gender: "MALE",
            date_of_birth: "1985-01-07",
            date_of_death: null,
            place_of_birth: "Stevenage",
            country_of_birth_country_id: "united-kingdom",
            nationality_country_id: "united-kingdom",
            second_nationality_country_id: null,
            best_championship_position: 1,
            best_starting_grid_position: 1,
            best_race_result: 1,
            total_championship_wins: 7,
            total_race_entries: 347,
            total_race_starts: 347,
            total_race_wins: 105,
            total_race_laps: 19823,
            total_podiums: 201,
            total_points: new Decimal(4793.5),
            total_championship_points: new Decimal(4793.5),
            total_pole_positions: 104,
            total_fastest_laps: 67,
            total_driver_of_the_day: 16,
            total_grand_slams: 6
          }
        ];
        prisma.driver.findMany.mockResolvedValue(value);
        const drivers = await getAllDrivers();
        expect(drivers).toEqual(expect.arrayContaining(value));
    });

    test("Get one driver", async () => {
      const value =
        {
          id: "lewis-hamilton",
          name: "Lewis Hamilton",
          first_name: "Lewis",
          last_name: "Hamilton",
          full_name: "Lewis Carl Davidson Hamilton",
          abbreviation: "HAM",
          permanent_number: "44",
          gender: "MALE",
          date_of_birth: "1985-01-07",
          date_of_death: null,
          place_of_birth: "Stevenage",
          country_of_birth_country_id: "united-kingdom",
          nationality_country_id: "united-kingdom",
          second_nationality_country_id: null,
          best_championship_position: 1,
          best_starting_grid_position: 1,
          best_race_result: 1,
          total_championship_wins: 7,
          total_race_entries: 347,
          total_race_starts: 347,
          total_race_wins: 105,
          total_race_laps: 19823,
          total_podiums: 201,
          total_points: new Decimal(4793.5),
          total_championship_points: new Decimal(4793.5),
          total_pole_positions: 104,
          total_fastest_laps: 67,
          total_driver_of_the_day: 16,
          total_grand_slams: 6
        };
      prisma.driver.findUnique.mockResolvedValue(value);
      expect(await getOneDriver("lewis-hamilton")).toEqual(value);
    });

    test("Error is thrown when driver is not found", async () => {
        await expect(getOneDriver("kimi-antonelli")).rejects.toThrow("No Driver Found");
    });

    test("Get all drivers with search query", async () => {
      const value = [
        {
          id: "lewis-hamilton",
          name: "Lewis Hamilton",
          first_name: "Lewis",
          last_name: "Hamilton",
          full_name: "Lewis Carl Davidson Hamilton",
          abbreviation: "HAM",
          permanent_number: "44",
          gender: "MALE",
          date_of_birth: "1985-01-07",
          date_of_death: null,
          place_of_birth: "Stevenage",
          country_of_birth_country_id: "united-kingdom",
          nationality_country_id: "united-kingdom",
          second_nationality_country_id: null,
          best_championship_position: 1,
          best_starting_grid_position: 1,
          best_race_result: 1,
          total_championship_wins: 7,
          total_race_entries: 347,
          total_race_starts: 347,
          total_race_wins: 105,
          total_race_laps: 19823,
          total_podiums: 201,
          total_points: new Decimal(4793.5),
          total_championship_points: new Decimal(4793.5),
          total_pole_positions: 104,
          total_fastest_laps: 67,
          total_driver_of_the_day: 16,
          total_grand_slams: 6
        }
      ];
      prisma.driver.findMany.mockResolvedValue(value);
      const drivers = await getAllDrivers({name: "lewis"});
      expect(drivers).toEqual(expect.arrayContaining(value));
    });
});