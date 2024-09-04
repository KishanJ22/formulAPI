import { describe, expect, it } from 'vitest';
import axios, { AxiosResponse, AxiosError } from "axios";
import prisma from '../db';
import { appUrl } from '../config';

const driversAxios = axios.create({
  baseURL: `${appUrl}`
});

describe("Driver Integration Tests", () => {
  
  describe("GET /drivers", () => {
    it("should return a response with a 200 status code", async () => {
      const response: AxiosResponse = await driversAxios.get("/drivers");
      expect(response.status).toEqual(200);
    });
  
    it("should return the driver objects in the correct format", async () => {
      const response: AxiosResponse = await driversAxios.get("/drivers");
      const firstDriverFromResponse = response.data[0];
      const expectedDriver = await prisma.driver.findFirst();
      const expectedDriverKeys = Object.keys(expectedDriver as object);
      const firstDriverKeys = Object.keys(firstDriverFromResponse);
      expect(firstDriverKeys).toEqual(expect.arrayContaining(expectedDriverKeys));
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

    it('should return all drivers with the same amount of total_championship_wins', async () => {
      const total_championship_wins = 7;
      const response = await driversAxios.get("/drivers", { params: { total_championship_wins } });
      const expectedDrivers = await prisma.driver.findMany({ select: { total_championship_wins: true }, where: { total_championship_wins } });
      const championshipWinsFromResponse = response.data.map((driver: any) => driver.total_championship_wins);
      const championshipWinsFromExpected = expectedDrivers.map((driver: any) => driver.total_championship_wins);
      expect(championshipWinsFromResponse).toEqual(expect.arrayContaining(championshipWinsFromExpected));
    });
  });

  describe("GET /drivers/:id", () => {
    it("should return the expected driver", async () => {
      const id = "lewis-hamilton";
      const response = await driversAxios.get(`/drivers/${id}`);
      const expectedDriver = await prisma.driver.findUnique({ where: { id } });
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
        expect(errorResponse?.data).toEqual({ message: "No Driver Found" });
        expect(errorResponse?.status).toEqual(404);
      }
    });
  });
});