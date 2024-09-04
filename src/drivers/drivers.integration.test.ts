import { describe, expect, it } from 'vitest';
import { driversAxios } from '../index';
import { AxiosResponse, AxiosError } from "axios";

describe("Driver Integration Tests", () => {
  
  describe("GET /drivers", () => {
    it("should return a response with a 200 status code", async () => {
      const response: AxiosResponse = await driversAxios.get("/drivers");
      expect(response.status).toEqual(200);
    });
  
    it("should return the driver objects in the correct format", async () => {
      const response: AxiosResponse = await driversAxios.get("/drivers");
      const expectedDrivers =
      [{
          "id": "adderly-fong",
          "name": "Adderly Fong",
          "first_name": "Adderly",
          "last_name": "Fong",
          "full_name": "Adderly Fong Cheun-yue",
          "abbreviation": "FON",
          "permanent_number": null,
          "gender": "MALE",
          "date_of_birth": "1990-03-02",
          "date_of_death": null,
          "place_of_birth": "Vancouver",
          "country_of_birth_country_id": "canada",
          "nationality_country_id": "hong-kong",
          "second_nationality_country_id": null,
          "best_championship_position": null,
          "best_starting_grid_position": null,
          "best_race_result": null,
          "total_championship_wins": 0,
          "total_race_entries": 0,
          "total_race_starts": 0,
          "total_race_wins": 0,
          "total_race_laps": 0,
          "total_podiums": 0,
          "total_points": "0",
          "total_championship_points": "0",
          "total_pole_positions": 0,
          "total_fastest_laps": 0,
          "total_driver_of_the_day": 0,
          "total_grand_slams": 0
        },
        {
          "id": "adolf-brudes",
          "name": "Adolf Brudes",
          "first_name": "Adolf",
          "last_name": "Brudes",
          "full_name": "Adolf Brudes von Breslau",
          "abbreviation": "BRU",
          "permanent_number": null,
          "gender": "MALE",
          "date_of_birth": "1899-10-15",
          "date_of_death": "1986-11-05",
          "place_of_birth": "Groß Kottulin",
          "country_of_birth_country_id": "germany",
          "nationality_country_id": "germany",
          "second_nationality_country_id": null,
          "best_championship_position": null,
          "best_starting_grid_position": 19,
          "best_race_result": null,
          "total_championship_wins": 0,
          "total_race_entries": 1,
          "total_race_starts": 1,
          "total_race_wins": 0,
          "total_race_laps": 5,
          "total_podiums": 0,
          "total_points": "0",
          "total_championship_points": "0",
          "total_pole_positions": 0,
          "total_fastest_laps": 0,
          "total_driver_of_the_day": 0,
          "total_grand_slams": 0
        }];
      expect(response.data).toEqual(expect.arrayContaining(expectedDrivers));
    });

    it("should throw the `Invalid Search Query` 404 error when an invalid query key is used", async () => {
      const invalid_query = "invalid";
      try {
        await driversAxios.get("/drivers", { params: { invalid_query } });
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        expect(errorResponse?.data).toEqual({ message: "Invalid Search Query" });
        expect(errorResponse?.status).toEqual(404);
      }
    });

    it("should throw the `No Drivers Found` 404 error when no drivers are found", async () => {
      const last_name = "ronaldo";
      try {
        await driversAxios.get("/drivers", { params: { last_name } });
        throw new Error("404 error not thrown");
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        expect(errorResponse?.data).toEqual({ message: "No Drivers Found" });
        expect(errorResponse?.status).toEqual(404);
      }
    });
  });

  describe("GET /drivers/:id", () => {
    it("should return the expected driver", async () => {
      const id = "lewis-hamilton";
      const response = await driversAxios.get(`/drivers/${id}`);
      const expectedDriver = {
        "id": "lewis-hamilton",
        "name": "Lewis Hamilton",
        "first_name": "Lewis",
        "last_name": "Hamilton",
        "full_name": "Lewis Carl Davidson Hamilton",
        "abbreviation": "HAM",
        "permanent_number": "44",
        "gender": "MALE",
        "date_of_birth": "1985-01-07",
        "date_of_death": null,
        "place_of_birth": "Stevenage",
        "country_of_birth_country_id": "united-kingdom",
        "nationality_country_id": "united-kingdom",
        "second_nationality_country_id": null,
        "best_championship_position": 1,
        "best_starting_grid_position": 1,
        "best_race_result": 1,
        "total_championship_wins": 7,
        "total_race_entries": 347,
        "total_race_starts": 347,
        "total_race_wins": 105,
        "total_race_laps": 19823,
        "total_podiums": 201,
        "total_points": "4793.5",
        "total_championship_points": "4793.5",
        "total_pole_positions": 104,
        "total_fastest_laps": 67,
        "total_driver_of_the_day": 16,
        "total_grand_slams": 6
      }
      expect(response.data).toStrictEqual(expectedDriver);
    });

    it("should throw the `No Driver Found` 404 error when an invalid id is used", async () => {
      const id = "cristiano-ronaldo";
      try {
        const response = await driversAxios.get(`/drivers/${id}`);
        throw new Error("404 error not thrown");
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        expect(errorResponse?.data).toEqual({ message: "No Driver Found" });
        expect(errorResponse?.status).toEqual(404);
      }
    });
  });
});