import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import axios, { AxiosResponse, AxiosError } from "axios";
import prisma from "../__mocks__/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { BASE_URL } from "../config";
import { closemockApp, createmockApp } from "../__mocks__/express";

describe("Driver Integration Tests", () => {
    let driversAxios: any;

    beforeAll(async () => {
        const mockApp = createmockApp();

        driversAxios = axios.create({
            baseURL: BASE_URL,
        });
    });

    afterEach(async () => {
        vi.clearAllMocks();
    });

    afterAll(async () => {
        await closemockApp();
    });

    describe("GET /drivers", () => {
        it("should return a response with a 200 status code", async () => {
            const response: AxiosResponse = await driversAxios.get("/drivers");
            expect(response.status).toEqual(200);
        });

        it("should return the driver objects in the correct format", async () => {
            const response: AxiosResponse = await driversAxios.get("/drivers");
            const firstDriverFromResponse = response.data[0];

            prisma.driver.findFirst.mockResolvedValue({
                id: "adderly-fong",
                name: "Adderly Fong",
                first_name: "Adderly",
                last_name: "Fong",
                full_name: "Adderly Fong Cheun-yue",
                abbreviation: "FON",
                permanent_number: null,
                gender: "MALE",
                date_of_birth: new Date("1990-03-02T00:00:00.000Z"),
                date_of_death: null,
                place_of_birth: "Vancouver",
                country_of_birth_country_id: "canada",
                nationality_country_id: "hong-kong",
                second_nationality_country_id: null,
                best_championship_position: null,
                best_starting_grid_position: null,
                best_race_result: null,
                total_championship_wins: 0,
                total_race_entries: 0,
                total_race_starts: 0,
                total_race_wins: 0,
                total_race_laps: 0,
                total_podiums: 0,
                total_points: new Decimal(0),
                total_championship_points: new Decimal(0),
                total_pole_positions: 0,
                total_fastest_laps: 0,
                total_driver_of_the_day: 0,
                total_grand_slams: 0,
            });

            const expectedDriver = await prisma.driver.findFirst();
            const expectedDriverKeys = Object.keys(expectedDriver as object);
            const firstDriverKeys = Object.keys(firstDriverFromResponse);

            expect(firstDriverKeys).toEqual(
                expect.arrayContaining(expectedDriverKeys),
            );
        });

        it("should throw the `Invalid Search Query` 404 error when an invalid query key is used", async () => {
            const invalid_query = "invalid";
            try {
                await driversAxios.get("/drivers", {
                    params: { invalid_query },
                });
            } catch (error) {
                const errorResponse = (error as AxiosError).response;
                expect(errorResponse?.data).toEqual({
                    message: "Invalid Search Query",
                });
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
                expect(errorResponse?.data).toEqual({
                    message: "No Drivers Found",
                });
                expect(errorResponse?.status).toEqual(404);
            }
        });

        it("should return all drivers with the same amount of total_championship_wins", async () => {
            const total_championship_wins = 7;
            const response = await driversAxios.get("/drivers", {
                params: { total_championship_wins },
            });

            prisma.driver.findMany.mockResolvedValue([
                {
                    id: "lewis-hamilton",
                    name: "Lewis Hamilton",
                    first_name: "Lewis",
                    last_name: "Hamilton",
                    full_name: "Lewis Carl Davidson Hamilton",
                    abbreviation: "HAM",
                    permanent_number: "44",
                    gender: "MALE",
                    date_of_birth: new Date("1985-01-07T00:00:00.000Z"),
                    date_of_death: null,
                    place_of_birth: "Stevenage",
                    country_of_birth_country_id: "united-kingdom",
                    nationality_country_id: "united-kingdom",
                    second_nationality_country_id: null,
                    best_championship_position: 1,
                    best_starting_grid_position: 1,
                    best_race_result: 1,
                    total_championship_wins: 7,
                    total_race_entries: 353,
                    total_race_starts: 353,
                    total_race_wins: 105,
                    total_race_laps: 20130,
                    total_podiums: 201,
                    total_points: new Decimal(4829.5),
                    total_championship_points: new Decimal(4829.5),
                    total_pole_positions: 104,
                    total_fastest_laps: 67,
                    total_driver_of_the_day: 16,
                    total_grand_slams: 6,
                },
                {
                    id: "michael-schumacher",
                    name: "Michael Schumacher",
                    first_name: "Michael",
                    last_name: "Schumacher",
                    full_name: "Michael Schumacher",
                    abbreviation: "MSC",
                    permanent_number: null,
                    gender: "MALE",
                    date_of_birth: new Date("1969-01-03T00:00:00.000Z"),
                    date_of_death: null,
                    place_of_birth: "Hürth",
                    country_of_birth_country_id: "germany",
                    nationality_country_id: "germany",
                    second_nationality_country_id: null,
                    best_championship_position: 1,
                    best_starting_grid_position: 1,
                    best_race_result: 1,
                    total_championship_wins: 7,
                    total_race_entries: 308,
                    total_race_starts: 306,
                    total_race_wins: 91,
                    total_race_laps: 16825,
                    total_podiums: 155,
                    total_points: new Decimal(1566),
                    total_championship_points: new Decimal(1566),
                    total_pole_positions: 68,
                    total_fastest_laps: 77,
                    total_driver_of_the_day: 0,
                    total_grand_slams: 5,
                },
            ]);

            const expectedDrivers = await prisma.driver.findMany({
                select: { total_championship_wins: true },
                where: { total_championship_wins },
            });
            const championshipWinsFromResponse = response.data.map(
                (driver: any) => driver.total_championship_wins,
            );
            const championshipWinsFromExpected = expectedDrivers.map(
                (driver: any) => driver.total_championship_wins,
            );
            expect(championshipWinsFromResponse).toEqual(
                expect.arrayContaining(championshipWinsFromExpected),
            );
        });
    });

    describe("GET /drivers/:id", () => {
        it("should return the expected driver", async () => {
            prisma.driver.findUnique.mockResolvedValue({
                id: "lewis-hamilton",
                name: "Lewis Hamilton",
                first_name: "Lewis",
                last_name: "Hamilton",
                full_name: "Lewis Carl Davidson Hamilton",
                abbreviation: "HAM",
                permanent_number: "44",
                gender: "MALE",
                date_of_birth: new Date("1985-01-07T00:00:00.000Z"),
                date_of_death: null,
                place_of_birth: "Stevenage",
                country_of_birth_country_id: "united-kingdom",
                nationality_country_id: "united-kingdom",
                second_nationality_country_id: null,
                best_championship_position: 1,
                best_starting_grid_position: 1,
                best_race_result: 1,
                total_championship_wins: 7,
                total_race_entries: 353,
                total_race_starts: 353,
                total_race_wins: 105,
                total_race_laps: 20130,
                total_podiums: 201,
                total_points: new Decimal(4829.5),
                total_championship_points: new Decimal(4829.5),
                total_pole_positions: 104,
                total_fastest_laps: 67,
                total_driver_of_the_day: 16,
                total_grand_slams: 6,
            });
            const id = "lewis-hamilton";
            const response = await driversAxios.get("/drivers/lewis-hamilton");
            const expectedDriver = await prisma.driver.findUnique({
                where: { id },
            });
            const idFromResponse = response.data.id;
            const idFromExpected = expectedDriver?.id;
            expect(idFromResponse).toEqual(idFromExpected);
        });

        it("should throw the `No Driver Found` 404 error when an invalid id is used", async () => {
            const id = "cristiano-ronaldo";
            try {
                const response = await driversAxios.get(`/drivers/${id}`);
            } catch (error) {
                const errorResponse = (error as AxiosError).response;
                expect(errorResponse?.data).toEqual({
                    message: "No Driver Found",
                });
                expect(errorResponse?.status).toEqual(404);
            }
        });
    });
});
